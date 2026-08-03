"use strict";

const scrollIndicator =
  document.querySelector("#scrollIndicator");

const socialSection =
  document.querySelector("#redes");

const backToTop =
  document.querySelector("#backToTop");

/*
  Desce suavemente até a seção das redes.
*/

scrollIndicator.addEventListener("click", () => {
  socialSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

/*
  Retorna suavemente ao início da página.
*/

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/*
  Quando uma pequena parte da seção social aparece,
  o botão de rolagem desaparece.

  Quando o usuário volta para cima,
  ele reaparece.
*/

const socialSectionObserver = new IntersectionObserver(
  ([entry]) => {
    const socialSectionIsVisible =
      entry.isIntersecting &&
      entry.intersectionRatio >= 0.08;

    scrollIndicator.classList.toggle(
      "is-hidden",
      socialSectionIsVisible
    );

    scrollIndicator.setAttribute(
      "aria-hidden",
      String(socialSectionIsVisible)
    );
  },
  {
    threshold: [0, 0.08, 0.2],
  }
);

socialSectionObserver.observe(socialSection);