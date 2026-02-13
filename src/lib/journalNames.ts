/**
 * 저널 약어 → 정식명 매핑 (엑셀에 약어 컬럼이 없어도 표시/매칭용으로 사용)
 * 엑셀 Abbreviation 컬럼이 있으면 그쪽이 우선 적용됨.
 */
export const JOURNAL_ABBR_TO_FULL: Record<string, string> = {
  "Adv. Sci.": "Advanced Science",
  "Adv. Energy Mater.": "Advanced Energy Materials",
  "Adv. Funct. Mater.": "Advanced Functional Materials",
  "Adv. Mater.": "Advanced Materials",
  "Appl. Surf. Sci.": "Applied Surface Science",
  "Appl. Catal. B: Environ.": "Applied Catalysis B: Environmental",
  "Appl. Catal. B-Enviro": "Applied Catalysis B: Environmental",
  "Appl. Catal. A-Gen": "Applied Catalysis A: General",
  "Chem. Eng. J.": "Chemical Engineering Journal",
  "J. Mater. Chem. A": "Journal of Materials Chemistry A",
  "J. Membr. Sci.": "Journal of Membrane Science",
  "J. Phys. Chem. Lett.": "Journal of Physical Chemistry Letters",
  "J. Phys. Chem. C": "Journal of Physical Chemistry C",
  "J. Mater. Res. Technol": "Journal of Materials Research and Technology",
  "J. Power Sources": "Journal of Power Sources",
  "ACS Nano": "ACS Nano",
  "ACS Catal.": "ACS Catalysis",
  "ACS Appl. Mater. Interfaces": "ACS Applied Materials & Interfaces",
  "ACS Applied Materials & Interfaces": "ACS Applied Materials & Interfaces",
  "ACS Sustain. Chem. Eng.": "ACS Sustainable Chemistry & Engineering",
  "Small": "Small",
  "Carbon": "Carbon",
  "Nanomaterials": "Nanomaterials",
  "Nano Energy": "Nano Energy",
  "Nano energy": "Nano Energy",
  "Nano Letters": "Nano Letters",
  "Nanoscale": "Nanoscale",
  "Nat. Commun.": "Nature Communications",
  "Electrochimica Acta": "Electrochimica Acta",
  "Int. J. Hydrog. Energy": "International Journal of Hydrogen Energy",
  "ChemSusChem": "ChemSusChem",
  "Electrochem. Commun.": "Electrochemistry Communications",
  "Front. Chem.": "Frontiers in Chemistry",
  "Energy Technology": "Energy Technology",
  "Renewables": "Renewables",
  "NPG Asia Materials": "NPG Asia Materials",
  "Synth. Met.": "Synthetic Metals",
  "Top. Catal": "Topics in Catalysis",
  "Catal. Today": "Catalysis Today",
};

/** 저장된 저널명(약어 가능)을 정식명으로 변환해 표시용으로 사용 */
export function getJournalDisplayName(journal: string | undefined): string {
  if (!journal || !journal.trim()) return "";
  const trimmed = journal.trim();
  return JOURNAL_ABBR_TO_FULL[trimmed] ?? trimmed;
}
