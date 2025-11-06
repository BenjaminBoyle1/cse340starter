// public/js/form-validation.js
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form.needs-validation")

  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")

    inputs.forEach((input) => {
      // Inline message element
      let errorSpan = document.createElement("span")
      errorSpan.classList.add("client-error")
      input.insertAdjacentElement("afterend", errorSpan)

      // Live input validation
      input.addEventListener("input", () => {
        const isValid = input.checkValidity()
        input.classList.toggle("valid", isValid)
        input.classList.toggle("invalid", !isValid)
        errorSpan.textContent = isValid ? "" : input.validationMessage
      })
    })

    // Prevent submission if invalid
    form.addEventListener("submit", (e) => {
      let formValid = true

      inputs.forEach((input) => {
        const isValid = input.checkValidity()
        input.classList.toggle("valid", isValid)
        input.classList.toggle("invalid", !isValid)

        const errorSpan = input.nextElementSibling
        if (!isValid && errorSpan) {
          formValid = false
          errorSpan.textContent = input.validationMessage
        } else if (errorSpan) {
          errorSpan.textContent = ""
        }
      })

      if (!formValid) {
        e.preventDefault()
      }
    })
  })
})
