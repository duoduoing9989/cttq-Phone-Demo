// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
 
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      // if (confirm('A new version of this site is available. Load it?')) {
      window.location.reload();
      // }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);
}, false);

function downloading(e){
	//alert("加载弹框")
	// loading_state("新版本加载中，请稍后...","show");

}

function finDownloading(e){
	//alert("关闭弹框")
    // loading_state("新版本加载完成","hide");
	// loading_state("加载完成，关闭...","hide");
}
function finsDownloading(){
     // loading_state("数据加载中，请稍后...","hide");
}

var appCache = window.applicationCache;
// Fired after the first cache of the manifest.
appCache.addEventListener('cached', finDownloading, false);

// Checking for an update. Always the first event fired in the sequence.
//appCache.addEventListener('checking', handleCacheEvent, false);

// An update was found. The browser is fetching resources.
appCache.addEventListener('downloading', downloading, false);

// The manifest returns 404 or 410, the download failed,
// or the manifest changed while the download was in progress.
appCache.addEventListener('error', finsDownloading, false);

// Fired after the first download of the manifest.
appCache.addEventListener('noupdate', finsDownloading, false);

// Fired if the manifest file returns a 404 or 410.
// This results in the application cache being deleted.
//appCache.addEventListener('obsolete', handleCacheEvent, false);

// Fired for each resource listed in the manifest as it is being fetched.
appCache.addEventListener('progress', downloading, false);

// Fired when the manifest resources have been newly redownloaded.

