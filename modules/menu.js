// document.querySelector('#menu button:contains("Import")')?.addEventListener('click', () => {
//   console.log("Import clicked");
//   // open file input or trigger load
// });

// document.querySelector('#menu button:contains("Export")')?.addEventListener('click', () => {
//   console.log("Export clicked");
//   // trigger export logic
// });

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('#menu');

  let dropdownActive = false;     // is a dropdown currently open
  let canHoverSwitch = false;     // is hover-switching allowed

  // Click to open a top-level menu
  menu.addEventListener('click', (e) => {
    const button = e.target.closest('.dropdown-toggle');
    if (button) {
      const li = button.closest('li');
      const isOpen = li.classList.contains('open');
      
      document.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
      
      if (!isOpen) {
        li.classList.add('open');
        dropdownActive = true;
        canHoverSwitch = true; // allow hover-switching
      } else {
        dropdownActive = false;
        canHoverSwitch = false;
      }

      e.stopPropagation();
    }
  });

  // Hover behavior for submenus
  menu.querySelectorAll('ul li').forEach((li) => {
    li.addEventListener('pointerenter', () => {
      if (dropdownActive && canHoverSwitch && li.querySelector('.dropdown')) {
        // Only close siblings, not all
        const parentUl = li.parentElement;
        parentUl.querySelectorAll(':scope > li.open').forEach(openLi => {
          if (openLi !== li) openLi.classList.remove('open');
        });
        li.classList.add('open');
      }
    });
  });

  // Click outside to close all
  document.addEventListener('pointerdown', (e) => {
    if (!menu.contains(e.target)) {
      document.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
      dropdownActive = false;
      canHoverSwitch = false;
    }
  });

  // leave
  menu.addEventListener('pointerleave', () => {
    if (dropdownActive) {
      canHoverSwitch = false;
    }
  });


  // Menu toggle button logic
  const toggleMenuBtn = document.querySelector('#toggle-menu-btn');
  let menuOpen = true;

  toggleMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      toggleMenuBtn.innerHTML = '&#x25C0;'; // ◀
      menu.classList.remove('collapsed');
      toggleMenuBtn.classList.remove('collapsed');
    } else {
      toggleMenuBtn.innerHTML = '&#x25B6;'; // ▶
      menu.classList.add('collapsed');
      toggleMenuBtn.classList.add('collapsed');
    }
  });

  // About section
  const aboutBtn = document.querySelector('#menu button.about');
  const aboutModal = document.getElementById('about-section');
  const closeAboutBtn = document.getElementById('close-about-btn');
  
  aboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    aboutModal.style.display = 'flex';
  });

  closeAboutBtn.addEventListener('click', () => {
    aboutModal.style.display = 'none';
  });

  // Optional: close modal if clicking backdrop
  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
      aboutModal.style.display = 'none';
    }
  });

    
  // Inspector toggle
  const toggleInspectorBtn = document.querySelector('#toggle-inspector-btn');
  let inspectorOpen = true;

  toggleInspectorBtn.addEventListener('click', () => {
    inspectorOpen = !inspectorOpen;

    if (inspectorOpen) {
      toggleInspectorBtn.innerHTML = '&#x25B6;'; // ▶
      inspector.classList.remove('collapsed');
      toggleInspectorBtn.classList.remove('collapsed');
    } else {
      toggleInspectorBtn.innerHTML = '&#x25C0;'; // ◀
      inspector.classList.add('collapsed');
      toggleInspectorBtn.classList.add('collapsed');
    }
  });

  // Tab toggle for each section 
  document.querySelectorAll('.toggle-tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.closest('.tab');
      tab.classList.toggle('collapsed');

      const arrow = button.querySelector('.arrow');
      arrow.textContent = tab.classList.contains('collapsed') ? '›' : '‹';
    });
  });

  // Tool carousel
  const carousel = document.querySelector('.tool-carousel');

  carousel.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault(); // stop vertical scroll
      carousel.scrollLeft += e.deltaY * 0.1; // scroll sideways
    }
  }, { passive: false });





});
