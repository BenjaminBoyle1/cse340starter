// public/js/inventory-validation.js
(function () {
  const forms = document.querySelectorAll(".needs-validation")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) {
        e.preventDefault()
        e.stopPropagation()
      }
      form.classList.add("was-validated")
    })
  })

  const nameInput = document.querySelector("#classification_name")
  if (nameInput) {
    nameInput.setAttribute("pattern", "^[A-Za-z0-9_]+$")
    nameInput.setAttribute("title", "Use letters, numbers, or underscore. No spaces or special characters.")
  }
})()
