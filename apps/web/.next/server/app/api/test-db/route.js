/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/test-db/route";
exports.ids = ["app/api/test-db/route"];
exports.modules = {

/***/ "(rsc)/./app/api/test-db/route.ts":
/*!**********************************!*\
  !*** ./app/api/test-db/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\nasync function GET() {\n    try {\n        // Test database connection\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.$connect();\n        // Try a simple query\n        const result = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.$queryRaw`SELECT 1 as test`;\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.$disconnect();\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: \"Database connection successful\",\n            result\n        });\n    } catch (error) {\n        console.error(\"Database connection error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: \"Database connection failed\",\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Rlc3QtZGIvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJDO0FBQ0U7QUFFdEMsZUFBZUU7SUFDcEIsSUFBSTtRQUNGLDJCQUEyQjtRQUMzQixNQUFNRCwrQ0FBTUEsQ0FBQ0UsUUFBUTtRQUVyQixxQkFBcUI7UUFDckIsTUFBTUMsU0FBUyxNQUFNSCwrQ0FBTUEsQ0FBQ0ksU0FBUyxDQUFDLGdCQUFnQixDQUFDO1FBRXZELE1BQU1KLCtDQUFNQSxDQUFDSyxXQUFXO1FBRXhCLE9BQU9OLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFDdkJDLFNBQVM7WUFDVEMsU0FBUztZQUNUTDtRQUNGO0lBQ0YsRUFBRSxPQUFPTSxPQUFZO1FBQ25CQyxRQUFRRCxLQUFLLENBQUMsOEJBQThCQTtRQUU1QyxPQUFPVixxREFBWUEsQ0FBQ08sSUFBSSxDQUN0QjtZQUNFQyxTQUFTO1lBQ1RDLFNBQVM7WUFDVEMsT0FBT0EsTUFBTUQsT0FBTztRQUN0QixHQUNBO1lBQUVHLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEVuZ2luXFxEb2N1bWVudHNcXGN1cnNvciBwcm9qZWN0c1xcZGVnZXJhbmFsaXpcXGFwcHNcXHdlYlxcYXBwXFxhcGlcXHRlc3QtZGJcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiLi4vLi4vLi4vbGliL3ByaXNtYVwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICB0cnkge1xyXG4gICAgLy8gVGVzdCBkYXRhYmFzZSBjb25uZWN0aW9uXHJcbiAgICBhd2FpdCBwcmlzbWEuJGNvbm5lY3QoKTtcclxuXHJcbiAgICAvLyBUcnkgYSBzaW1wbGUgcXVlcnlcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByaXNtYS4kcXVlcnlSYXdgU0VMRUNUIDEgYXMgdGVzdGA7XHJcblxyXG4gICAgYXdhaXQgcHJpc21hLiRkaXNjb25uZWN0KCk7XHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogXCJEYXRhYmFzZSBjb25uZWN0aW9uIHN1Y2Nlc3NmdWxcIixcclxuICAgICAgcmVzdWx0LFxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZXJyb3I6XCIsIGVycm9yKTtcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHtcclxuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICBtZXNzYWdlOiBcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkXCIsXHJcbiAgICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInByaXNtYSIsIkdFVCIsIiRjb25uZWN0IiwicmVzdWx0IiwiJHF1ZXJ5UmF3IiwiJGRpc2Nvbm5lY3QiLCJqc29uIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJlcnJvciIsImNvbnNvbGUiLCJzdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/test-db/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFHO0FBRW5FLElBQUlJLElBQXFDLEVBQUVILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxFbmdpblxcRG9jdW1lbnRzXFxjdXJzb3IgcHJvamVjdHNcXGRlZ2VyYW5hbGl6XFxhcHBzXFx3ZWJcXGxpYlxccHJpc21hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xyXG5cclxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcclxuICBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKTtcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XHJcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwicHJvY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-db%2Froute&page=%2Fapi%2Ftest-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-db%2Froute.ts&appDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-db%2Froute&page=%2Fapi%2Ftest-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-db%2Froute.ts&appDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Engin_Documents_cursor_projects_degeranaliz_apps_web_app_api_test_db_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/test-db/route.ts */ \"(rsc)/./app/api/test-db/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/test-db/route\",\n        pathname: \"/api/test-db\",\n        filename: \"route\",\n        bundlePath: \"app/api/test-db/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Engin\\\\Documents\\\\cursor projects\\\\degeranaliz\\\\apps\\\\web\\\\app\\\\api\\\\test-db\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Engin_Documents_cursor_projects_degeranaliz_apps_web_app_api_test_db_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ0ZXN0LWRiJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ0ZXN0LWRiJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdGVzdC1kYiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNFbmdpbiU1Q0RvY3VtZW50cyU1Q2N1cnNvciUyMHByb2plY3RzJTVDZGVnZXJhbmFsaXolNUNhcHBzJTVDd2ViJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNFbmdpbiU1Q0RvY3VtZW50cyU1Q2N1cnNvciUyMHByb2plY3RzJTVDZGVnZXJhbmFsaXolNUNhcHBzJTVDd2ViJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNpRDtBQUM5SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcRW5naW5cXFxcRG9jdW1lbnRzXFxcXGN1cnNvciBwcm9qZWN0c1xcXFxkZWdlcmFuYWxpelxcXFxhcHBzXFxcXHdlYlxcXFxhcHBcXFxcYXBpXFxcXHRlc3QtZGJcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3Rlc3QtZGIvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS90ZXN0LWRiXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS90ZXN0LWRiL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcRW5naW5cXFxcRG9jdW1lbnRzXFxcXGN1cnNvciBwcm9qZWN0c1xcXFxkZWdlcmFuYWxpelxcXFxhcHBzXFxcXHdlYlxcXFxhcHBcXFxcYXBpXFxcXHRlc3QtZGJcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-db%2Froute&page=%2Fapi%2Ftest-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-db%2Froute.ts&appDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftest-db%2Froute&page=%2Fapi%2Ftest-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftest-db%2Froute.ts&appDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CEngin%5CDocuments%5Ccursor%20projects%5Cdegeranaliz%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();