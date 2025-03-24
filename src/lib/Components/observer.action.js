export const observe = (node, params = {}) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.dispatchEvent(new CustomEvent("enterview"));
        } else {
          node.dispatchEvent(new CustomEvent("exitview"));
        }
      });
    },
    {
      threshold: params.threshold ?? 0.1,
      root: params.root ?? null,
      rootMargin: params.rootMargin ?? "0px",
    },
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
    update(newParams) {
      observer.disconnect();
      observer.observe(node);
    },
  };
};
