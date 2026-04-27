import { formatCurrency } from "@/utils/format";

describe("formatCurrency", () => {
  it("formatea con dos decimales", () => {
    expect(formatCurrency(12.5)).toBe("$ 12.50");
  });
});
