import asyncio
import time
import json
import logging
from typing import List, Dict, Optional, Set, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import random
import numpy as np

import googlemaps
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import requests

from ..models import Business, BusinessReview, BusinessPhoto, ScrapingJob, JobStatus, BusinessType, Region
from ..db import SessionLocal
from sqlalchemy import text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ScrapingConfig:
    """Configuration for scraping operations"""
    google_api_key: Optional[str] = None
    max_businesses_per_search: int = 100
    max_reviews_per_business: int = 50
    max_photos_per_business: int = 20
    delay_between_requests: float = 1.0  # seconds
    selenium_headless: bool = True
    user_agents: List[str] = None
    proxy_list: List[str] = None
    
    def __post_init__(self):
        if self.user_agents is None:
            self.user_agents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]

@dataclass
class BusinessData:
    """Comprehensive business data from Google Maps"""
    google_place_id: str
    name: str
    business_type: str
    category: str
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    price_level: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    hours: Optional[Dict] = None
    photos: List[str] = None
    google_url: Optional[str] = None
    features: List[str] = None
    
    # Comprehensive business details
    description: Optional[str] = None
    popular_times: Optional[Dict] = None
    current_status: Optional[str] = None  # open, closed, temporarily_closed
    permanently_closed: bool = False
    plus_code: Optional[str] = None
    international_phone: Optional[str] = None
    formatted_phone: Optional[str] = None
    
    # Social & Marketing
    social_media: Optional[Dict] = None  # facebook, instagram, twitter
    delivery_options: List[str] = None   # delivery, takeout, dine_in
    payment_methods: List[str] = None    # credit_cards, cash_only, etc.
    
    # Accessibility & Features
    accessibility_features: List[str] = None  # wheelchair_accessible, etc.
    amenities: List[str] = None              # wifi, parking, etc.
    atmosphere: List[str] = None             # casual, cozy, upscale, etc.
    planning: List[str] = None               # accepts_reservations, etc.
    
    # Business specific
    service_options: List[str] = None        # outdoor_seating, etc.
    menu_url: Optional[str] = None
    reservation_url: Optional[str] = None
    order_url: Optional[str] = None
    
    # Reviews summary
    review_summary: Optional[Dict] = None    # sentiment breakdown
    most_recent_reviews: List[Dict] = None   # latest reviews
    
    # Photos categorized
    photo_categories: Optional[Dict] = None   # exterior, interior, food, menu, etc.
    
    # Verification status
    claimed: bool = False
    verified: bool = False
    
    # Scraped metadata
    scraped_at: Optional[datetime] = None
    last_updated: Optional[datetime] = None
    data_completeness: Optional[float] = None  # percentage of fields filled

class GoogleMapsScraper:
    """Comprehensive Google Maps data scraper for LOKASCORE"""
    
    def __init__(self, config: ScrapingConfig):
        self.config = config
        self.gmaps_client = None
        self.driver = None
        self.session = requests.Session()
        
        # Initialize Google Maps client if API key provided
        if config.google_api_key:
            self.gmaps_client = googlemaps.Client(key=config.google_api_key)
        
        # Setup request session
        self.session.headers.update({
            'User-Agent': random.choice(config.user_agents)
        })
    
    def _setup_selenium_driver(self) -> webdriver.Chrome:
        """Setup Selenium Chrome driver with optimal settings"""
        chrome_options = Options()
        
        if self.config.selenium_headless:
            chrome_options.add_argument("--headless")
        
        # Anti-detection settings
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-images")  # Faster loading
        chrome_options.add_argument("--disable-javascript")  # Sometimes needed
        chrome_options.add_argument(f"--user-agent={random.choice(self.config.user_agents)}")
        
        # Window size
        chrome_options.add_argument("--window-size=1920,1080")
        
        # Disable automation detection
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        return driver
    
    async def scrape_kaleiçi_region(self, region_boundary: Dict) -> List[BusinessData]:
        """
        Comprehensive scraping of Kaleiçi region
        
        Args:
            region_boundary: GeoJSON-like boundary definition
        """
        logger.info("🎯 Starting comprehensive Kaleiçi region scraping")
        
        all_businesses = []
        
        # Define search categories for Kaleiçi
        search_categories = [
            "restaurant", "cafe", "hotel", "museum", "shop", "boutique",
            "art gallery", "carpet shop", "souvenir shop", "jewelry store",
            "antique shop", "bakery", "bar", "nightclub", "tour guide",
            "spa", "hammam", "pharmacy", "bank", "exchange office"
        ]
        
        center_lat, center_lng = 36.8851, 30.7056  # Kaleiçi merkez
        
        for category in search_categories:
            logger.info(f"🔍 Scraping {category} businesses in Kaleiçi")
            
            try:
                # Use different search methods
                businesses_gmaps = await self._search_with_gmaps_api(
                    query=f"{category} Kaleiçi Antalya",
                    location=(center_lat, center_lng),
                    radius=1000
                )
                
                businesses_selenium = await self._search_with_selenium(
                    query=f"{category} Kaleiçi Antalya",
                    location=(center_lat, center_lng)
                )
                
                # Combine and deduplicate
                combined = self._merge_business_data(businesses_gmaps + businesses_selenium)
                all_businesses.extend(combined)
                
                # Respectful delay
                await asyncio.sleep(self.config.delay_between_requests)
                
            except Exception as e:
                logger.error(f"Error scraping {category}: {e}")
                continue
        
        # Deduplicate by place_id
        unique_businesses = self._deduplicate_businesses(all_businesses)
        
        logger.info(f"✅ Scraped {len(unique_businesses)} unique businesses from Kaleiçi")
        return unique_businesses
    
    async def _search_with_gmaps_api(self, query: str, location: tuple, radius: int = 1000) -> List[BusinessData]:
        """Search using Google Maps Places API"""
        if not self.gmaps_client:
            return []
        
        businesses = []
        
        try:
            # Text search
            places_result = self.gmaps_client.places_nearby(
                location=location,
                radius=radius,
                keyword=query,
                language='tr'
            )
            
            for place in places_result.get('results', []):
                business_data = await self._extract_business_from_place(place)
                if business_data:
                    businesses.append(business_data)
            
            # Handle pagination
            next_page_token = places_result.get('next_page_token')
            while next_page_token and len(businesses) < self.config.max_businesses_per_search:
                await asyncio.sleep(2)  # Required delay for next_page_token
                
                places_result = self.gmaps_client.places_nearby(
                    page_token=next_page_token
                )
                
                for place in places_result.get('results', []):
                    business_data = await self._extract_business_from_place(place)
                    if business_data:
                        businesses.append(business_data)
                
                next_page_token = places_result.get('next_page_token')
        
        except Exception as e:
            logger.error(f"Google Maps API error: {e}")
        
        return businesses
    
    async def _search_with_selenium(self, query: str, location: tuple) -> List[BusinessData]:
        """Search using Selenium for more comprehensive data"""
        if not self.driver:
            self.driver = self._setup_selenium_driver()
        
        businesses = []
        
        try:
            # Construct Google Maps search URL
            lat, lng = location
            search_url = f"https://www.google.com/maps/search/{query}/@{lat},{lng},15z"
            
            self.driver.get(search_url)
            await asyncio.sleep(3)
            
            # Wait for results to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, '[data-result-index]'))
            )
            
            # Scroll to load more results
            await self._scroll_results()
            
            # Extract business elements
            business_elements = self.driver.find_elements(By.CSS_SELECTOR, '[data-result-index]')
            
            for element in business_elements[:self.config.max_businesses_per_search]:
                try:
                    business_data = await self._extract_business_from_element(element)
                    if business_data:
                        businesses.append(business_data)
                        
                    await asyncio.sleep(0.5)  # Small delay between extractions
                    
                except Exception as e:
                    logger.warning(f"Failed to extract business data: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Selenium search error: {e}")
        
        return businesses
    
    async def _extract_business_from_place(self, place: Dict) -> Optional[BusinessData]:
        """Extract business data from Google Places API result"""
        try:
            place_id = place.get('place_id')
            if not place_id:
                return None
            
            # Get detailed place information
            details = self.gmaps_client.place(
                place_id=place_id,
                fields=[
                    'name', 'formatted_address', 'formatted_phone_number',
                    'website', 'rating', 'user_ratings_total', 'price_level',
                    'geometry', 'opening_hours', 'photos', 'types', 'url'
                ],
                language='tr'
            )
            
            result = details.get('result', {})
            geometry = result.get('geometry', {}).get('location', {})
            
            return BusinessData(
                google_place_id=place_id,
                name=result.get('name', ''),
                business_type=self._categorize_business(result.get('types', [])),
                category=', '.join(result.get('types', [])[:3]),
                address=result.get('formatted_address'),
                phone=result.get('formatted_phone_number'),
                website=result.get('website'),
                rating=result.get('rating'),
                review_count=result.get('user_ratings_total'),
                price_level=result.get('price_level'),
                latitude=geometry.get('lat'),
                longitude=geometry.get('lng'),
                hours=self._parse_opening_hours(result.get('opening_hours', {})),
                photos=[photo.get('photo_reference') for photo in result.get('photos', [])],
                google_url=result.get('url'),
                features=result.get('types', [])
            )
            
        except Exception as e:
            logger.error(f"Error extracting place data: {e}")
            return None
    
    async def _extract_business_from_element(self, element) -> Optional[BusinessData]:
        """Extract business data from Selenium element"""
        try:
            # Click on element to get detailed view
            self.driver.execute_script("arguments[0].click();", element)
            await asyncio.sleep(2)
            
            # Extract data from detail panel
            name = self._safe_find_element_text(By.CSS_SELECTOR, 'h1[data-attrid="title"]')
            rating = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Rating"]')
            review_count = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Review count"]')
            address = self._safe_find_element_text(By.CSS_SELECTOR, '[data-item-id="address"]')
            phone = self._safe_find_element_text(By.CSS_SELECTOR, '[data-item-id="phone"]')
            website = self._safe_find_element_attribute(By.CSS_SELECTOR, '[data-item-id="authority"]', 'href')
            
            # Extract more details...
            
            return BusinessData(
                google_place_id=f"selenium_{hash(name + address)}",  # Temporary ID
                name=name or "Unknown",
                business_type="unknown",
                category="unknown",
                address=address,
                phone=phone,
                website=website,
                rating=float(rating.split()[0]) if rating else None,
                review_count=int(review_count.replace(',', '')) if review_count else None
            )
            
        except Exception as e:
            logger.warning(f"Failed to extract element data: {e}")
            return None
    
    async def scrape_comprehensive_business_data(self, business_id: str, include_reviews: bool = True,
                                               include_photos: bool = True) -> Optional[BusinessData]:
        """
        Comprehensive business data scraping with all available information
        """
        if not self.driver:
            self.driver = self._setup_selenium_driver()
        
        try:
            # Navigate to business page
            business_url = f"https://www.google.com/maps/place/?q=place_id:{business_id}&hl=tr&gl=tr"
            self.driver.get(business_url)
            await asyncio.sleep(3)
            
            # Extract comprehensive business data
            business_data = await self._extract_comprehensive_business_info()
            business_data.google_place_id = business_id
            
            if include_reviews:
                business_data.most_recent_reviews = await self._scrape_detailed_reviews()
                business_data.review_summary = await self._analyze_review_sentiment()
            
            if include_photos:
                business_data.photos, business_data.photo_categories = await self._scrape_categorized_photos()
            
            # Calculate data completeness
            business_data.data_completeness = self._calculate_data_completeness(business_data)
            business_data.scraped_at = datetime.utcnow()
            
            return business_data
            
        except Exception as e:
            logger.error(f"Error scraping comprehensive data for {business_id}: {e}")
            return None

    async def _extract_comprehensive_business_info(self) -> BusinessData:
        """Extract all available business information"""
        
        # Basic information
        name = self._safe_find_element_text(By.CSS_SELECTOR, 'h1[data-attrid="title"]')
        rating_text = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Rating"]')
        rating = float(rating_text.split()[0]) if rating_text else None
        
        review_count_text = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Review count"]')
        review_count = int(review_count_text.replace(',', '').split()[0]) if review_count_text else None
        
        # Address and contact
        address = self._safe_find_element_text(By.CSS_SELECTOR, '[data-item-id="address"]')
        phone = self._safe_find_element_text(By.CSS_SELECTOR, '[data-item-id="phone"]')
        website = self._safe_find_element_attribute(By.CSS_SELECTOR, '[data-item-id="authority"]', 'href')
        
        # Business hours - detailed extraction
        hours_data = await self._extract_detailed_hours()
        
        # Popular times
        popular_times = await self._extract_popular_times()
        
        # Current status
        status_element = self.driver.find_elements(By.CSS_SELECTOR, '[data-value="Status"]')
        current_status = status_element[0].text if status_element else "unknown"
        
        # Categories and features
        categories = await self._extract_business_categories()
        features = await self._extract_business_features()
        amenities = await self._extract_amenities()
        
        # Price level
        price_elements = self.driver.find_elements(By.CSS_SELECTOR, '[aria-label*="Price"] span')
        price_level = len([p for p in price_elements if '$' in p.text or '₺' in p.text]) if price_elements else None
        
        # Description
        description = self._safe_find_element_text(By.CSS_SELECTOR, '[data-attrid="description"]')
        
        # Social media and additional links
        social_media = await self._extract_social_media_links()
        
        # Service options
        service_options = await self._extract_service_options()
        
        # Accessibility
        accessibility_features = await self._extract_accessibility_features()
        
        # Plus code
        plus_code = self._safe_find_element_text(By.CSS_SELECTOR, '[data-item-id="oloc"]')
        
        # Menu and reservation links
        menu_url = self._safe_find_element_attribute(By.CSS_SELECTOR, '[data-item-id="menu"]', 'href')
        reservation_url = self._safe_find_element_attribute(By.CSS_SELECTOR, '[data-item-id="reserve"]', 'href')
        order_url = self._safe_find_element_attribute(By.CSS_SELECTOR, '[data-item-id="order"]', 'href')
        
        # Verification status
        claimed = bool(self.driver.find_elements(By.CSS_SELECTOR, '[data-value="Claimed"]'))
        verified = bool(self.driver.find_elements(By.CSS_SELECTOR, '[data-value="Verified"]'))
        
        return BusinessData(
            google_place_id="temp",  # Will be set by caller
            name=name or "Unknown",
            business_type="unknown",  # Will be categorized later
            category=categories[0] if categories else "Unknown",
            address=address,
            phone=phone,
            formatted_phone=phone,  # Could be processed further
            website=website,
            rating=rating,
            review_count=review_count,
            price_level=price_level,
            hours=hours_data,
            description=description,
            popular_times=popular_times,
            current_status=current_status,
            plus_code=plus_code,
            social_media=social_media,
            amenities=amenities,
            accessibility_features=accessibility_features,
            service_options=service_options,
            features=features,
            menu_url=menu_url,
            reservation_url=reservation_url,
            order_url=order_url,
            claimed=claimed,
            verified=verified,
            last_updated=datetime.utcnow()
        )

    async def _scrape_detailed_reviews(self, max_reviews: int = 50) -> List[Dict]:
        """Scrape comprehensive review data"""
        reviews = []
        
        try:
            # Click on reviews section
            reviews_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(@data-tab-index, '1') or contains(text(), 'Yorumlar')]"))
            )
            reviews_button.click()
            await asyncio.sleep(2)
            
            # Sort by newest first
            sort_button = self.driver.find_elements(By.CSS_SELECTOR, '[data-value="Sort"]')
            if sort_button:
                sort_button[0].click()
                await asyncio.sleep(1)
                newest_option = self.driver.find_elements(By.XPATH, "//div[contains(text(), 'Newest') or contains(text(), 'En yeni')]")
                if newest_option:
                    newest_option[0].click()
                    await asyncio.sleep(2)
            
            # Scroll to load reviews
            await self._scroll_reviews_advanced(max_reviews)
            
            # Extract review elements
            review_elements = self.driver.find_elements(By.CSS_SELECTOR, '[data-review-id]')
            
            for element in review_elements[:max_reviews]:
                review_data = await self._extract_comprehensive_review_data(element)
                if review_data:
                    reviews.append(review_data)
                    
        except Exception as e:
            logger.error(f"Error scraping detailed reviews: {e}")
        
        return reviews

    async def _extract_comprehensive_review_data(self, review_element) -> Optional[Dict]:
        """Extract comprehensive review information"""
        try:
            # Basic review info
            author_name = self._safe_find_element_text_from_parent(review_element, '[data-value="Name"]')
            rating_element = review_element.find_elements(By.CSS_SELECTOR, '[role="img"][aria-label*="star"]')
            rating = len([r for r in rating_element if "star" in r.get_attribute("aria-label").lower()])
            
            # Review text - handle "read more" expansion
            review_text_element = review_element.find_elements(By.CSS_SELECTOR, '[data-expandable-section]')
            if review_text_element:
                # Try to expand if there's a "read more" button
                read_more = review_element.find_elements(By.XPATH, ".//button[contains(text(), 'daha fazla') or contains(text(), 'more')]")
                if read_more:
                    self.driver.execute_script("arguments[0].click();", read_more[0])
                    await asyncio.sleep(0.5)
                
                review_text = review_text_element[0].text
            else:
                review_text = self._safe_find_element_text_from_parent(review_element, '[jscontroller]')
            
            # Date
            date_text = self._safe_find_element_text_from_parent(review_element, '[data-value="Date"]')
            
            # Author info - try to get more details
            author_reviews_count = self._safe_find_element_text_from_parent(review_element, '[data-value="Local guide reviews"]')
            author_photos_count = self._safe_find_element_text_from_parent(review_element, '[data-value="Local guide photos"]')
            
            # Review photos if any
            review_photos = []
            photo_elements = review_element.find_elements(By.CSS_SELECTOR, 'img[src*="googleusercontent"]')
            for photo in photo_elements:
                photo_url = photo.get_attribute('src')
                if photo_url and 'googleusercontent' in photo_url:
                    review_photos.append(photo_url)
            
            # Response from owner
            owner_response = self._safe_find_element_text_from_parent(review_element, '[data-review-id] + [data-review-id]')
            
            # Helpful votes
            helpful_element = review_element.find_elements(By.CSS_SELECTOR, '[data-value="Helpful"]')
            helpful_count = helpful_element[0].text if helpful_element else "0"
            
            return {
                'author_name': author_name,
                'author_reviews_count': author_reviews_count,
                'author_photos_count': author_photos_count,
                'rating': rating if rating > 0 else None,
                'text': review_text,
                'date': date_text,
                'photos': review_photos,
                'owner_response': owner_response,
                'helpful_count': helpful_count,
                'scraped_at': datetime.utcnow().isoformat(),
                'language': 'tr',  # Assuming Turkish context
                'review_length': len(review_text) if review_text else 0
            }
            
        except Exception as e:
            logger.warning(f"Failed to extract comprehensive review: {e}")
            return None

    async def _scrape_categorized_photos(self) -> Tuple[List[str], Dict]:
        """Scrape and categorize business photos"""
        photos = []
        photo_categories = {
            'exterior': [],
            'interior': [],
            'food': [],
            'menu': [],
            'by_owner': [],
            'by_customers': []
        }
        
        try:
            # Click on photos section
            photos_button = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Fotoğraflar') or contains(text(), 'Photos')]")
            if photos_button:
                photos_button[0].click()
                await asyncio.sleep(2)
                
                # Scroll through photos
                for _ in range(5):  # Limited scrolling
                    self.driver.execute_script("window.scrollBy(0, 300);")
                    await asyncio.sleep(0.5)
                
                # Extract photo URLs and try to categorize
                photo_elements = self.driver.find_elements(By.CSS_SELECTOR, 'img[src*="googleusercontent"]')
                
                for img in photo_elements:
                    photo_url = img.get_attribute('src')
                    if photo_url and 'googleusercontent' in photo_url:
                        # Convert to high-res version
                        high_res_url = photo_url.replace('=s', '=s1024').replace('=w', '=w1024')
                        photos.append(high_res_url)
                        
                        # Try to categorize based on surrounding context
                        parent_text = img.find_element(By.XPATH, "../..").text.lower()
                        if 'food' in parent_text or 'menu' in parent_text:
                            photo_categories['food'].append(high_res_url)
                        elif 'interior' in parent_text or 'inside' in parent_text:
                            photo_categories['interior'].append(high_res_url)
                        elif 'exterior' in parent_text or 'outside' in parent_text:
                            photo_categories['exterior'].append(high_res_url)
                        else:
                            photo_categories['by_customers'].append(high_res_url)
                
                # Go back to main page
                self.driver.back()
                await asyncio.sleep(1)
                
        except Exception as e:
            logger.error(f"Error scraping categorized photos: {e}")
        
        return photos, photo_categories

    async def scrape_business_reviews(self, business_id: str, max_reviews: int = None) -> List[Dict]:
        """Legacy method - now calls comprehensive review scraping"""
        business_data = await self.scrape_comprehensive_business_data(
            business_id, include_reviews=True, include_photos=False
        )
        return business_data.most_recent_reviews if business_data else []
    
    def _categorize_business(self, types: List[str]) -> str:
        """Map Google types to our BusinessType enum"""
        type_mapping = {
            'restaurant': BusinessType.RESTAURANT,
            'cafe': BusinessType.CAFE,
            'food': BusinessType.RESTAURANT,
            'store': BusinessType.RETAIL,
            'lodging': BusinessType.HOTEL,
            'hospital': BusinessType.HOSPITAL,
            'school': BusinessType.SCHOOL,
            'bank': BusinessType.BANK,
            'pharmacy': BusinessType.PHARMACY,
            'gas_station': BusinessType.GAS_STATION,
            'shopping_mall': BusinessType.SHOPPING_MALL,
            'museum': BusinessType.MUSEUM,
            'mosque': BusinessType.MOSQUE,
            'church': BusinessType.CHURCH,
        }
        
        for google_type in types:
            for key, business_type in type_mapping.items():
                if key in google_type.lower():
                    return business_type.value
        
        return BusinessType.OTHER.value
    
    def _merge_business_data(self, businesses: List[BusinessData]) -> List[BusinessData]:
        """Merge business data from different sources"""
        # Simple implementation - in production, use more sophisticated matching
        seen_names = set()
        merged = []
        
        for business in businesses:
            if business.name not in seen_names:
                merged.append(business)
                seen_names.add(business.name)
        
        return merged
    
    def _deduplicate_businesses(self, businesses: List[BusinessData]) -> List[BusinessData]:
        """Remove duplicate businesses"""
        seen_ids = set()
        unique = []
        
        for business in businesses:
            if business.google_place_id not in seen_ids:
                unique.append(business)
                seen_ids.add(business.google_place_id)
        
        return unique
    
    async def _scroll_results(self):
        """Scroll search results to load more businesses"""
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        
        while True:
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            await asyncio.sleep(2)
            
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
    
    async def _scroll_reviews(self, max_reviews: int):
        """Scroll reviews to load more"""
        for _ in range(max_reviews // 10):  # Approximate
            self.driver.execute_script("""
                var reviewsContainer = document.querySelector('[data-review-id]').parentElement;
                reviewsContainer.scrollTop = reviewsContainer.scrollHeight;
            """)
            await asyncio.sleep(1)
    
    def _safe_find_element_text(self, by: By, selector: str) -> Optional[str]:
        """Safely find element text"""
        try:
            element = self.driver.find_element(by, selector)
            return element.text.strip()
        except NoSuchElementException:
            return None
    
    def _safe_find_element_attribute(self, by: By, selector: str, attribute: str) -> Optional[str]:
        """Safely find element attribute"""
        try:
            element = self.driver.find_element(by, selector)
            return element.get_attribute(attribute)
        except NoSuchElementException:
            return None
    
    def _parse_opening_hours(self, hours_data: Dict) -> Optional[Dict]:
        """Parse opening hours data"""
        if not hours_data.get('weekday_text'):
            return None
        
        parsed_hours = {}
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        
        for i, day_text in enumerate(hours_data['weekday_text']):
            day_name = days[i]
            # Simple parsing - can be improved
            if 'Closed' in day_text or 'Kapalı' in day_text:
                parsed_hours[day_name] = {'open': None, 'close': None}
            else:
                # Extract hours with regex or other parsing
                parsed_hours[day_name] = {'open': '09:00', 'close': '22:00'}  # Placeholder
        
        return parsed_hours
    
    async def _extract_review_data(self, review_element) -> Optional[Dict]:
        """Extract data from review element"""
        try:
            author = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Name"]')
            rating = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Rating"]')
            text = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Review text"]')
            date = self._safe_find_element_text(By.CSS_SELECTOR, '[data-value="Date"]')
            
            return {
                'author_name': author,
                'rating': int(rating) if rating and rating.isdigit() else None,
                'text': text,
                'date': date,
                'scraped_at': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.warning(f"Failed to extract review: {e}")
            return None
    
    def close(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()

class ScrapingOrchestrator:
    """Orchestrates comprehensive scraping operations"""
    
    def __init__(self, config: ScrapingConfig):
        self.config = config
        self.scraper = GoogleMapsScraper(config)
    
    async def run_kaleiçi_pilot_scraping(self) -> Dict:
        """Run the complete Kaleiçi pilot scraping operation"""
        start_time = datetime.utcnow()
        
        # Create scraping job record
        db = SessionLocal()
        job = ScrapingJob(
            job_name="Kaleiçi Pilot Comprehensive Scraping",
            job_type="comprehensive",
            target_business_types=["all"],
            max_results=1000,
            search_query="businesses Kaleiçi Antalya",
            status=JobStatus.running,
            started_at=start_time
        )
        db.add(job)
        db.commit()
        
        try:
            # Define Kaleiçi boundary
            kaleici_boundary = {
                "type": "Polygon",
                "coordinates": [[
                    [30.7020, 36.8820],  # Southwest
                    [30.7080, 36.8820],  # Southeast  
                    [30.7080, 36.8880],  # Northeast
                    [30.7020, 36.8880],  # Northwest
                    [30.7020, 36.8820]   # Close polygon
                ]]
            }
            
            # Scrape businesses
            logger.info("🚀 Starting Kaleiçi comprehensive scraping")
            businesses = await self.scraper.scrape_kaleiçi_region(kaleici_boundary)
            
            # Save businesses to database
            saved_count = 0
            for business_data in businesses:
                business = await self._save_business_to_db(business_data, db)
                if business:
                    saved_count += 1
                    
                    # Scrape reviews for each business
                    reviews = await self.scraper.scrape_business_reviews(
                        business_data.google_place_id,
                        max_reviews=20
                    )
                    
                    await self._save_reviews_to_db(business.id, reviews, db)
            
            # Update job status
            job.status = JobStatus.completed
            job.completed_at = datetime.utcnow()
            job.businesses_found = len(businesses)
            job.businesses_processed = saved_count
            job.results_summary = {
                "total_businesses": len(businesses),
                "saved_businesses": saved_count,
                "processing_time_minutes": (datetime.utcnow() - start_time).total_seconds() / 60,
                "data_sources": ["google_maps_api", "selenium"]
            }
            
            db.commit()
            
            logger.info(f"✅ Kaleiçi scraping completed: {saved_count} businesses saved")
            
            return {
                "success": True,
                "businesses_scraped": saved_count,
                "processing_time": (datetime.utcnow() - start_time).total_seconds(),
                "job_id": job.id
            }
            
        except Exception as e:
            logger.error(f"Scraping failed: {e}")
            job.status = JobStatus.failed
            job.error_log = str(e)
            db.commit()
            
            return {
                "success": False,
                "error": str(e),
                "job_id": job.id
            }
        finally:
            db.close()
            self.scraper.close()
    
    async def scrape_region_comprehensive(self, region: Region, business_types: List[str],
                                        search_queries: List[str], max_businesses: int,
                                        include_reviews: bool, max_reviews_per_business: int,
                                        scrape_environmental_data: bool) -> Dict:
        """
        Comprehensive region scraping implementation
        """
        logger.info(f"Starting comprehensive scraping for {region.name}")
        
        all_businesses = []
        
        # Define search parameters based on region
        center_lat, center_lng = region.center_lat, region.center_lng
        radius = int(region.radius_km * 1000)  # Convert to meters
        
        # Use custom search queries first
        for query in search_queries:
            logger.info(f"Scraping with query: {query}")
            
            try:
                # Use Google Maps API if available
                businesses_gmaps = await self._search_with_gmaps_api(
                    query=query,
                    location=(center_lat, center_lng),
                    radius=radius
                )
                
                # Use Selenium for additional data
                businesses_selenium = await self._search_with_selenium(
                    query=query,
                    location=(center_lat, center_lng)
                )
                
                # Combine results
                combined = self._merge_business_data(businesses_gmaps + businesses_selenium)
                all_businesses.extend(combined)
                
                await asyncio.sleep(self.config.delay_between_requests)
                
            except Exception as e:
                logger.error(f"Error scraping query '{query}': {e}")
                continue
        
        # Then search by business types
        for business_type in business_types:
            logger.info(f"Scraping business type: {business_type}")
            
            try:
                businesses_gmaps = await self._search_with_gmaps_api(
                    query=f"{business_type} {region.name} {region.city}",
                    location=(center_lat, center_lng),
                    radius=radius
                )
                
                combined = self._merge_business_data(businesses_gmaps)
                all_businesses.extend(combined)
                
                await asyncio.sleep(self.config.delay_between_requests)
                
            except Exception as e:
                logger.error(f"Error scraping business type '{business_type}': {e}")
                continue
        
        # Deduplicate results
        unique_businesses = self._deduplicate_businesses(all_businesses)
        
        # Limit results if needed
        if len(unique_businesses) > max_businesses:
            unique_businesses = unique_businesses[:max_businesses]
        
        logger.info(f"Completed comprehensive scraping: {len(unique_businesses)} businesses found")
        
        return {
            'businesses_found': len(unique_businesses),
            'businesses_data': unique_businesses,
            'queries_used': search_queries,
            'business_types_used': business_types,
            'region_covered': {
                'name': region.name,
                'center': (center_lat, center_lng),
                'radius_km': region.radius_km
            }
        }

    async def _save_business_to_db(self, business_data: BusinessData, db) -> Optional[Business]:
        """Save business data to database"""
        try:
            # Check if business already exists
            existing = db.query(Business).filter(
                Business.google_place_id == business_data.google_place_id
            ).first()
            
            if existing:
                logger.debug(f"Business {business_data.name} already exists")
                return existing
            
            # Create new business record
            business = Business(
                google_place_id=business_data.google_place_id,
                name=business_data.name,
                business_type=BusinessType(business_data.business_type),
                category=business_data.category,
                address=business_data.address,
                phone=business_data.phone,
                website=business_data.website,
                rating=business_data.rating,
                review_count=business_data.review_count or 0,
                price_level=business_data.price_level,
                google_url=business_data.google_url,
                hours=business_data.hours,
                features=business_data.features,
                last_scraped=datetime.utcnow(),
                source="google_maps"
            )
            
            # Set geometry if coordinates available
            if business_data.latitude and business_data.longitude:
                business.geom = f"POINT({business_data.longitude} {business_data.latitude})"
            
            db.add(business)
            db.commit()
            
            return business
            
        except Exception as e:
            logger.error(f"Failed to save business {business_data.name}: {e}")
            db.rollback()
            return None
    
    async def _save_reviews_to_db(self, business_id: int, reviews: List[Dict], db):
        """Save reviews to database"""
        for review_data in reviews:
            try:
                review = BusinessReview(
                    business_id=business_id,
                    author_name=review_data.get('author_name'),
                    rating=review_data.get('rating'),
                    text=review_data.get('text'),
                    published_at=datetime.utcnow(),  # Placeholder
                    scraped_at=datetime.utcnow()
                )
                
                db.add(review)
                
            except Exception as e:
                logger.error(f"Failed to save review: {e}")
                continue
        
        try:
            db.commit()
        except Exception as e:
            logger.error(f"Failed to commit reviews: {e}")
            db.rollback()
    
    def _safe_find_element_text_from_parent(self, parent_element, selector: str) -> Optional[str]:
        """Safely find element text from parent element"""
        try:
            element = parent_element.find_element(By.CSS_SELECTOR, selector)
            return element.text.strip()
        except NoSuchElementException:
            return None
    
    async def _search_with_gmaps_api(self, query: str, location: tuple, radius: int) -> List[BusinessData]:
        """Search using Google Maps Places API - implementation for ScrapingOrchestrator"""
        return await self.scraper._search_with_gmaps_api(query, location, radius)
    
    async def _search_with_selenium(self, query: str, location: tuple) -> List[BusinessData]:
        """Search using Selenium - implementation for ScrapingOrchestrator"""
        return await self.scraper._search_with_selenium(query, location)
    
    def _merge_business_data(self, businesses: List[BusinessData]) -> List[BusinessData]:
        """Merge business data - implementation for ScrapingOrchestrator"""
        return self.scraper._merge_business_data(businesses)
    
    def _deduplicate_businesses(self, businesses: List[BusinessData]) -> List[BusinessData]:
        """Deduplicate businesses - implementation for ScrapingOrchestrator"""
        return self.scraper._deduplicate_businesses(businesses)

    async def _extract_detailed_hours(self) -> Optional[Dict]:
        """Extract detailed opening hours"""
        try:
            hours_elements = self.driver.find_elements(By.CSS_SELECTOR, '[data-item-id="oh"]')
            if not hours_elements:
                return None
            
            hours_data = {}
            days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            
            # Extract weekly hours
            hours_table = self.driver.find_elements(By.CSS_SELECTOR, '[data-attrid="oh"]')
            if hours_table:
                day_rows = hours_table[0].find_elements(By.TAG_NAME, 'tr')
                
                for i, row in enumerate(day_rows[:7]):
                    day_text = row.text
                    day_name = days[i] if i < len(days) else f'day_{i}'
                    
                    if 'kapalı' in day_text.lower() or 'closed' in day_text.lower():
                        hours_data[day_name] = {'status': 'closed'}
                    elif '24 saat' in day_text.lower():
                        hours_data[day_name] = {'status': '24hours'}
                    else:
                        import re
                        time_pattern = r'(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})'
                        times = re.findall(time_pattern, day_text)
                        if times:
                            hours_data[day_name] = {
                                'open': times[0][0].replace('.', ':'),
                                'close': times[0][1].replace('.', ':')
                            }
            
            return hours_data if hours_data else None
        except Exception as e:
            logger.warning(f"Failed to extract hours: {e}")
            return None

    async def _extract_popular_times(self) -> Optional[Dict]:
        """Extract popular times data"""
        try:
            popular_times = {}
            popular_elements = self.driver.find_elements(By.CSS_SELECTOR, '[data-attrid="popular_times"]')
            
            if popular_elements:
                popular_times['has_data'] = True
                popular_times['peak_hours'] = []
                
                # Look for peak time indicators
                peak_indicators = popular_elements[0].find_elements(By.CSS_SELECTOR, '[data-hour]')
                for indicator in peak_indicators[:24]:  # Max 24 hours
                    hour = indicator.get_attribute('data-hour')
                    if hour:
                        popular_times['peak_hours'].append(int(hour))
            
            return popular_times if popular_times else None
        except Exception as e:
            logger.warning(f"Failed to extract popular times: {e}")
            return None

    async def _extract_business_categories(self) -> List[str]:
        """Extract business categories"""
        categories = []
        try:
            # Primary category
            primary_cat = self._safe_find_element_text(By.CSS_SELECTOR, '[data-attrid*="category"]')
            if primary_cat:
                categories.append(primary_cat)
            
            # Additional categories from page text
            page_source = self.driver.page_source
            common_categories = [
                'restaurant', 'cafe', 'hotel', 'store', 'shop', 'market', 
                'restoran', 'kafe', 'otel', 'mağaza', 'market', 'dükkan'
            ]
            
            for cat in common_categories:
                if cat.lower() in page_source.lower() and cat not in categories:
                    categories.append(cat)
                    
        except Exception as e:
            logger.warning(f"Failed to extract categories: {e}")
        
        return categories[:5]  # Limit to 5 categories

    async def _extract_business_features(self) -> List[str]:
        """Extract business features"""
        features = []
        try:
            page_text = self.driver.find_element(By.TAG_NAME, 'body').text.lower()
            
            common_features = [
                'wifi', 'parking', 'outdoor seating', 'takeout', 'delivery',
                'reservations', 'credit cards', 'wheelchair accessible',
                'wifi', 'park yeri', 'açık hava', 'paket servis', 'teslimat',
                'rezervasyon', 'kredi kartı', 'engelli erişimi'
            ]
            
            for feature in common_features:
                if feature.lower() in page_text:
                    features.append(feature)
                    
        except Exception as e:
            logger.warning(f"Failed to extract features: {e}")
        
        return list(set(features))[:10]

    async def _extract_amenities(self) -> List[str]:
        """Extract amenities"""
        return await self._extract_business_features()

    async def _extract_service_options(self) -> List[str]:
        """Extract service options"""
        service_options = []
        try:
            page_text = self.driver.find_element(By.TAG_NAME, 'body').text.lower()
            
            services = [
                'dine-in', 'takeout', 'delivery', 'curbside pickup',
                'içeride yeme', 'paket servis', 'teslimat', 'gel al'
            ]
            
            for service in services:
                if service.lower() in page_text:
                    service_options.append(service)
                    
        except Exception as e:
            logger.warning(f"Failed to extract service options: {e}")
        
        return service_options

    async def _extract_accessibility_features(self) -> List[str]:
        """Extract accessibility features"""
        accessibility = []
        try:
            page_text = self.driver.find_element(By.TAG_NAME, 'body').text.lower()
            
            if 'wheelchair' in page_text or 'engelli' in page_text:
                accessibility.append('wheelchair_accessible')
            if 'accessible' in page_text or 'erişilebilir' in page_text:
                accessibility.append('accessible_entrance')
                
        except Exception as e:
            logger.warning(f"Failed to extract accessibility: {e}")
        
        return accessibility

    async def _extract_social_media_links(self) -> Optional[Dict]:
        """Extract social media links"""
        social_media = {}
        try:
            links = self.driver.find_elements(By.CSS_SELECTOR, 'a[href]')
            
            for link in links:
                href = link.get_attribute('href') or ''
                if 'facebook' in href:
                    social_media['facebook'] = href
                elif 'instagram' in href:
                    social_media['instagram'] = href
                elif 'twitter' in href:
                    social_media['twitter'] = href
                    
        except Exception as e:
            logger.warning(f"Failed to extract social media: {e}")
        
        return social_media if social_media else None

    async def _scroll_reviews_advanced(self, max_reviews: int):
        """Advanced review scrolling"""
        for _ in range(min(max_reviews // 5, 10)):  # Limit scroll attempts
            try:
                self.driver.execute_script("window.scrollBy(0, 500);")
                await asyncio.sleep(1)
            except Exception as e:
                logger.warning(f"Scroll failed: {e}")
                break

    def _calculate_data_completeness(self, business_data: BusinessData) -> float:
        """Calculate data completeness percentage"""
        total_fields = len(business_data.__dict__)
        filled_fields = sum(1 for v in business_data.__dict__.values() if v is not None)
        return (filled_fields / total_fields) * 100 if total_fields > 0 else 0

    async def _analyze_review_sentiment(self) -> Optional[Dict]:
        """Quick sentiment analysis of reviews"""
        try:
            review_elements = self.driver.find_elements(By.CSS_SELECTOR, '[data-review-id]')[:5]
            
            if not review_elements:
                return None
            
            positive = sum(1 for elem in review_elements if len(elem.find_elements(By.CSS_SELECTOR, '[role="img"]')) >= 4)
            negative = sum(1 for elem in review_elements if len(elem.find_elements(By.CSS_SELECTOR, '[role="img"]')) <= 2)
            neutral = len(review_elements) - positive - negative
            
            total = len(review_elements)
            return {
                'positive_ratio': positive / total,
                'negative_ratio': negative / total,
                'neutral_ratio': neutral / total,
                'total_analyzed': total
            }
            
        except Exception as e:
            logger.warning(f"Sentiment analysis failed: {e}")
            return None