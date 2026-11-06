import type { OfficeInput } from "../types";
import herman from "./herman-family-dentistry.ts";

/**
 * Mockup option: Herman Family Dentistry with a hero photo (their office, from their own website),
 * to compare with the plain hero in herman-family-dentistry.ts.
 */
const hermanFamilyDentistryHero: OfficeInput = {
  ...herman,
  id: "herman-family-dentistry-hero",
  heroImage: {
    src: "/offices/herman/office.jpg",
    alt: "The Herman Family Dentistry office on South Quail Run Road, Vincennes",
    position: "72% 55%",
  },
};

export default hermanFamilyDentistryHero;
