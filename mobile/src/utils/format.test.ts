import { formatCurrency } from "@/utils/format";

describe("formatCurrency", () => {
  it("formatea en pesos colombianos sin decimales", () => {
    expect(formatCurrency(12.5)).toContain("13");
  });
});
