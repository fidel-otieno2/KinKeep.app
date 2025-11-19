// Clear storage and force Instagram theme
localStorage.clear();
sessionStorage.clear();

// Set Instagram theme flag
localStorage.setItem('instagram-theme', 'true');

console.log('Storage cleared, Instagram theme applied');