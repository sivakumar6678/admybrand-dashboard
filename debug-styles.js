// Debug script to check if styles are loading
console.log('=== STYLE DEBUG ===');

// Check if CSS custom properties are defined
const root = document.documentElement;
const computedStyle = getComputedStyle(root);

console.log('CSS Variables:');
console.log('--primary:', computedStyle.getPropertyValue('--primary'));
console.log('--background:', computedStyle.getPropertyValue('--background'));
console.log('--gradient-primary:', computedStyle.getPropertyValue('--gradient-primary'));

// Check if Tailwind classes are working
const testDiv = document.createElement('div');
testDiv.className = 'bg-primary text-white p-4 rounded-lg';
testDiv.textContent = 'Test Element';
testDiv.style.position = 'fixed';
testDiv.style.top = '10px';
testDiv.style.right = '10px';
testDiv.style.zIndex = '9999';
document.body.appendChild(testDiv);

// Check if custom classes are working
const testDiv2 = document.createElement('div');
testDiv2.className = 'gradient-primary p-4 rounded-lg text-white';
testDiv2.textContent = 'Gradient Test';
testDiv2.style.position = 'fixed';
testDiv2.style.top = '60px';
testDiv2.style.right = '10px';
testDiv2.style.zIndex = '9999';
document.body.appendChild(testDiv2);

console.log('Test elements added to page');

// Remove test elements after 5 seconds
setTimeout(() => {
  testDiv.remove();
  testDiv2.remove();
  console.log('Test elements removed');
}, 5000);