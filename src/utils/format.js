export const formatMoeda = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};
export const formatPercent = (valor) => {
  if (valor === null) {
    return null;
  }
  return new Intl.NumberFormat("pt-BR", { style: "percent" }).format(valor);
};
