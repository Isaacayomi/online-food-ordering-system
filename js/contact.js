document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  let isValid = true;

  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

  if (name.value.trim() === '') {
    document.getElementById('nameError').textContent = 'Please enter your name';
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    document.getElementById('emailError').textContent = 'Please enter a valid email';
    isValid = false;
  }

  if (subject.value.trim() === '') {
    document.getElementById('subjectError').textContent = 'Please enter a subject';
    isValid = false;
  }

  if (message.value.trim() === '') {
    document.getElementById('messageError').textContent = 'Please enter your message';
    isValid = false;
  }

  if (isValid) {
    document.getElementById('formSuccess').style.display = 'block';
    this.reset();
  }
});