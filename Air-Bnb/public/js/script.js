(() => {
  'use strict';

  // Bootstrap form validation
  document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Image upload preview
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');
  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
      } else {
        imagePreview.style.display = 'none';
      }
    });
  }

  // Flash auto-dismiss after 4 seconds
  setTimeout(() => {
    document.querySelectorAll('.flash-success, .flash-error').forEach(el => {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 500);
    });
  }, 4000);

})();

// Delete confirmation dialog (called inline via onsubmit)
function confirmDelete() {
  return confirm('Are you sure you want to delete this listing? This cannot be undone.');
}

// Mobile nav toggle (called inline via onclick)
function toggleMobileNav() {
  const panel = document.getElementById('mobileNavPanel');
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || panel.style.display === '';
  panel.style.display = isHidden ? 'block' : 'none';
}