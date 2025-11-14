// 실제 논문 데이터
export interface Publication {
  number: number;
  role?: string; // "Corresponding" or "First Author"
  authors: string;
  title: string;
  journal: string;
  year: number;
  status?: string; // "submitted" or published
  if?: number;
  jcrRanking?: string;
  specialNote?: string; // cover letter, etc.
}

export const publications: Publication[] = [
  {
    number: 97,
    role: "Corresponding",
    authors: "J. M. Lee, S. Jin, J. M. Hwang, M. S. Kang, J. Kang, S. M. Choi*, M. H. Seo*",
    title: "Learning from atoms: machine learning enabled design of durable PtCo fuel cell catalysts",
    journal: "submitted",
    year: 2025,
    status: "submitted"
  },
  {
    number: 96,
    role: "Corresponding",
    authors: "S. M. Woo, S. Jin, D. Kim, J. Lee, J. Park, J. M. Lee, M. H. Seo*",
    title: "Atomic and electrochemical insights into ORR durability in ordered PtNi intermetallic catalysts in acidic electrolyte for PEM fuel cells",
    journal: "submitted",
    year: 2025,
    status: "submitted"
  },
  {
    number: 95,
    role: "Corresponding",
    authors: "S. Jin, M. Park, J. Jeong, S.-W. Myeong, S. M. Woo, J. Lee, N. Kim, J. Ha, C. Kim, J. Lee, W. B. Kim*, M. H. Seo, S. M. Choi*",
    title: "From atomic-scale nanostructure design to AEMWE stack validation: Ordered PtNi electrocatalysts for long-term hydrogen production",
    journal: "submitted",
    year: 2025,
    status: "submitted"
  },
  {
    number: 94,
    role: "Corresponding",
    authors: "N. M. Kim, J. Lee, S. Jin, J. Jeong, S.-W. Myeong, J. S. Ha, J. Park, H. Lee, M. Park, C. Kim, S. Kim, S. Yang, Y. S. Park, J. Lee, J. Y. Lee, M. H. Seo*, S. M. Choi*",
    title: "Collapsing the Bottleneck by Interfacial Effect of Ni/CeO2 for Long-Term Hydrogen Production using Waste Alkaline Water in Practical-Scale Anion Exchange Membrane Water Electrolyzer",
    journal: "Adv. Sci.",
    year: 2025,
    if: 14.1,
    jcrRanking: "7.1%",
    specialNote: "Front cover"
  },
  {
    number: 93,
    authors: "H.-U. Park, I. Lim, E. Lee, M. H. Seo, B.-S. An, N. Kim, Y. Kwon, N. Jung*, G.-G. Park*",
    title: "Pressure-Induced Particle Size Control: A Protecting Layer-Free Strategy for Sub-4 nm PtFe@Pt Intermetallic Electrocatalysts",
    journal: "Chem. Eng. J.",
    year: 2025,
    if: 13.2,
    jcrRanking: "3.0%"
  },
  {
    number: 92,
    authors: "J. H. Seo, H. S. Yang, M. H. Seo, S. J. Kim, J. Lee, S. Kee, S. Habibpour, S.-N. Lim, W. Ahn, Y.-S. Jun",
    title: "Aligning graphene sheets in aerogel-based composites for enhanced electromagnetic interference absorption",
    journal: "Carbon",
    year: 2025,
    if: 11.6,
    jcrRanking: "10.1%"
  },
  {
    number: 91,
    role: "Corresponding",
    authors: "K. H. Kim, Y. S. Park, J. M. Lee, M. H. Seo*, S. H. Hong*, S. M. Choi*",
    title: "Evaluating the phase-dependent electrocatalytic activity of manganese phosphides for the hydrogen evolution reaction",
    journal: "J. Mater. Chem. A",
    year: 2025,
    if: 10.8,
    jcrRanking: "9.1%"
  },
  {
    number: 90,
    role: "Corresponding",
    authors: "J. Choi†, E. Lee†, S. M. Woo†, Y. Whang, Y. Kwon, M. H. Seo*, E. H. Cho*, G. G. Park*",
    title: "Effect of palladium core size on the activity and durability of Pt-Monolayer electrocatalysts for oxygen reduction reaction",
    journal: "Appl. Surf. Sci.",
    year: 2025,
    if: 6.3,
    jcrRanking: "10.9%"
  },
  {
    number: 89,
    role: "Corresponding",
    authors: "S. Jin†, S. M. Woo†, S. W. Myeong, S. Heo, J. Lee, N. I. Kim, C. Kim, J. Lee, S. M. Choi*, M. H. Seo*",
    title: "Precision-Engineered Intermetallic Nanostructured Electrocatalysts for Oxygen and Hydrogen Reactions in Renewable Energy Systems",
    journal: "Renewables",
    year: 2024
  },
  {
    number: 88,
    role: "Corresponding",
    authors: "Z. Deng†, S. Jin†, M. Gong, N. Chen, W. Chen, M. H. Seo*, and X. Wang*",
    title: "Potential-driven Coordinated Oxygen Migration in Electrocatalyst for Sustainable H2O2 Synthesis",
    journal: "ACS Nano",
    year: 2024,
    if: 15.8,
    jcrRanking: "6.0%"
  },
  {
    number: 87,
    role: "Corresponding",
    authors: "D. Jang†, M. Park†, J. B. Maeng, J. Ha, S. Choi, N. Kim, M. H. Seo*, and W. B. Kim*",
    title: "Structural Modification Effect of Se-doped Porous Carbon for Hydrogen Evolution Coupled Selective Electrooxidation of Ethylene Glycol to Value-added Glycolic Acid",
    journal: "Small",
    year: 2024,
    if: 13.0,
    jcrRanking: "7.26%"
  },
  {
    number: 86,
    role: "Corresponding",
    authors: "S. Jin†, J. H. Kwon†, J. M. Lee, Y. R. Kim, J. G. Albers, Y. W. Choi, S. M. Choi*, K. S. Eom*, and M. H. Seo*",
    title: "Straw in the Clay Soil\" Strategy: Anti-carbon corrosive fluorine-decorated Graphene nanoribbons@CNT composite for long-term PEMFC",
    journal: "Adv. Sci.",
    year: 2024,
    if: 14.3,
    jcrRanking: "6.62%",
    specialNote: "Front cover"
  },
  {
    number: 85,
    role: "Corresponding",
    authors: "N. C. Karima†, S. Jin†, S. M. Choi, K. J. Nyamtara, P. M. Nogales, M. C. Nguyen, S. H. Kim, S. N. Lim, S. K. Jeong, H. K. Kim*, M. H. Seo*, W. Ahn*",
    title: "Interaction mechanism between MOF derived cobalt/rGO composite and sulfur for long cycle life of lithium–sulfur batteries",
    journal: "Chem. Eng. J.",
    year: 2024,
    if: 13.3,
    jcrRanking: "4.12%"
  },
  {
    number: 84,
    role: "Corresponding",
    authors: "J. Y. Jeong†, J. M. Lee†, Y. S. Park, S. Jin, S. W. Myeong, S. Heo, H. Lee, J. G. Albers, Y. W. Choi, M. H. Seo*, S. M. Choi, J. Y. Lee",
    title: "High-performance RuO2/CNT paper electrode as cathode for anion exchange membrane water electrolysis",
    journal: "Appl. Catal. B: Environ.",
    year: 2024,
    if: 22.1,
    jcrRanking: "1.81%"
  },
  {
    number: 83,
    authors: "J. Kim, J. K. Seo, J. Song, S. Choi, J. Park, H. Park, J. Song, J. H. Noh, G. Oh, M. H. Seo, H. Lee, J. M. Lee, I. C. Jang, J. Kim, Hy. J. Kim, J. Ma*, J. Cho*, and J. J. Woo*",
    title: "Self-Converted Scaffold Enables Dendrite-Free and Long-Life Zn-Ion Batteries",
    journal: "Adv. Energy Mater.",
    year: 2024,
    if: 27.8,
    jcrRanking: "2.8%"
  },
  {
    number: 82,
    role: "Corresponding",
    authors: "J. Ji, M. Park, M. Kim, S. K. Kang, G. H. Park, J. Maeng, J. Ha, M. H. Seo*, W. B. Kim*",
    title: "Accelerated Conversion of Polysulfides for Ultra Long-Cycle of Li-S Battery at High-Rate over Cooperative Cathode Electrocatalyst of Ni0.261Co0.739S2/N-Doped CNTs",
    journal: "Adv. Sci.",
    year: 2024,
    if: 15.1,
    jcrRanking: "6.8%",
    specialNote: "Front cover"
  },
  {
    number: 81,
    authors: "Z. Xu, Z. Sun, J. Shan, S. Jin, J. Cui, Z. Deng, M. H. Seo, and X. Wang*",
    title: "O, N-Codoped, Self-Activated, Holey Carbon Sheets for Low-Cost And High-Loading Zinc-Ion Supercapacitors",
    journal: "Adv. Funct. Mater.",
    year: 2024,
    if: 18.5,
    jcrRanking: "4.5%"
  },
  {
    number: 80,
    role: "Corresponding",
    authors: "M. G. Park, J. M. Hwang, Y. P. Deng, D. U. Lee, G. Jiang, M. J. Jang, J. Fue, Y. Huf, S. M. Choi, Y. S. Jun, R. Feng, Qi. Ma, L. Yang, M. H. Seo*, Z. Bai*, and Z. Chen*",
    title: "Longevous Cycling of Rechargeable Zn-air Battery Enabled by \"raisin-bread\" Cobalt Oxynitride/Porous Carbon Hybrid Electrocatalysts",
    journal: "Adv. Mater.",
    year: 2024,
    if: 32.069,
    jcrRanking: "2.32%"
  },
  {
    number: 79,
    role: "Corresponding",
    authors: "M. S. Park, J. M. Hwang, S. Jin, H. J. Kim, S. M. Choi, M. H. Seo*, W. B. Kim*",
    title: "Unveiling the role of hydroxyl groups in glycerol as a critical descriptor for efficient electrocatalytic reforming of biomass molecules using PtCu alloy nanoparticle catalysts",
    journal: "Chem. Eng. J.",
    year: 2023,
    if: 16.744,
    jcrRanking: "2.279%"
  },
  {
    number: 78,
    role: "Corresponding",
    authors: "J. E. Cha, S. J. D. J. Seo, J. M. Hwang, M. H. Seo*, Y. W. Choi*, W. B. Kim*",
    title: "A reinforced composite membrane of two-layered asymmetric structure with Nafion ionomer and polyethylene substrate for improving proton exchange membrane fuel cell performance",
    journal: "Chem. Eng. J.",
    year: 2023,
    if: 16.744,
    jcrRanking: "2.279%"
  },
  {
    number: 77,
    authors: "S. H. Hong, K. H Ham, J. M. Hwang, S. W. Kang, M. H. Seo, Y. W. Choi, B. C Han, J. Y. Lee*, K. W. Cho*",
    title: "Active Motif Change of Ni-Fe Spinel Oxide by Ir Doping for Highly Durable and Facile Oxygen Evolution Reaction",
    journal: "Adv. Funct. Mater.",
    year: 2022,
    if: 18.808,
    jcrRanking: "4.927%"
  },
  {
    number: 76,
    authors: "A. Mkhohlakali*, X. Fuku, M. H. Seo, M. Modibedi, L. Khotseng, M. Mathe",
    title: "Electro-Design of Bimetallic PdTe Electrocatalyst for Ethanol Oxidation: Combined Experimental Approach and Ab Initio Density Functional Theory (DFT)—Based Study",
    journal: "Nanomaterials",
    year: 2021,
    if: 5.719
  },
  {
    number: 75,
    role: "Corresponding",
    authors: "L. S. Oh, M. S. Park, Y. S. Park, Y. M. Kim, W. G. Yoon, J. M. Hwang, E. H. Lim, J. H. Park, S. M. Choi, M. H. Seo*, and W. B. Kim*, Hyung Ju Kim*",
    title: "How to Change the Reaction Chemistry on Non‐Precious Metal Oxide Nanostructure Materials for Electrocatalytic Oxidation of Biomass‐Derived Glycerol to Renewable Chemicals?",
    journal: "Adv. Mater.",
    year: 2022,
    if: 32.069,
    jcrRanking: "2.32%"
  },
  {
    number: 74,
    authors: "X. Zhang, S. J., M. H. Seo, C. Shang, G. Zhou, X. Wang, G. Li*",
    title: "Hierarchical porous structure construction for highly stable self-supporting lithium metal anode",
    journal: "Nano Energy",
    year: 2022,
    if: 19.069,
    jcrRanking: "5.217%"
  },
  {
    number: 73,
    authors: "Z. Xu, S. Jin, N. Zhang, W. Deng, M. H. Seo, and X. Wang*",
    title: "Efficient Zn metal anode enabled by O, N-codoped carbon microflowers",
    journal: "Nano Letters",
    year: 2022,
    if: 12.262,
    jcrRanking: "8.07%"
  },
  {
    number: 72,
    authors: "V. T. Luu, Q. H. Nguyen, M. G. Park, H. L. Nguyen, M. H. Seo, S. K. Jeong, N. C. Cho, Y. W. Lee, Y. H. Cho, S. N. Lim*, Y. S. Jun*, W. Ahn*",
    title: "Cubic Garnet Solid Polymer Electrolyte for Room Temperature Operable All-Solid-State-Battery",
    journal: "J. Mater. Res. Technol",
    year: 2021,
    if: 6.237,
    jcrRanking: "5.494%"
  },
  {
    number: 71,
    authors: "J.-E. Cha, M. H. Seo, Y. W. Choi and W. B. Kim",
    title: "A practical approach to measuring the ion-transport number of cation-exchange membranes: Effects of junction potential and analyte concentration",
    journal: "J. Membr. Sci.",
    year: 2021,
    if: 10.530,
    jcrRanking: "4.444%"
  },
  {
    number: 70,
    authors: "S. J. Hong, H. Chun, J. H. Lee, B. H. Kim, M. H. Seo, J. h. Kang* and B.C. Han*",
    title: "First-Principles Based Machine-Learning Molecular Dynamics for Crystalline Polymers with Van der Waals Interactions",
    journal: "J. Phys. Chem. Lett.",
    year: 2021,
    if: 6.888,
    jcrRanking: "13.88%"
  },
  {
    number: 69,
    role: "Corresponding",
    authors: "Q. H. Nguyena, V. T. Luu, S. N. Lim, Y. W. Lee, Y. H. Cho, Y. S. Jun, M. H. Seo* and Wook Ahn*",
    title: "Metal–organic Frameworks Reinforce Carbon Nanotubes Sponge-derived Robust Three-dimensional Sulfur Host for Lithium–sulfur Batteries",
    journal: "ACS Appl. Mater. Interfaces",
    year: 2021,
    if: 10.383,
    jcrRanking: "14.202%"
  },
  {
    number: 68,
    role: "Corresponding",
    authors: "S. Jin, S. Y. Yang, J. M. Lee, M. S. Kang, S. M. Choi, W. Ahn, X. G. Fuku, R. M. Modibedi, B. C. Han *, and M. H. Seo*",
    title: "Fluorine-Decorated Graphene Nanoribbons for an Anticorrosive Polymer Electrolyte Membrane Fuel Cell",
    journal: "ACS Appl. Mater. Interfaces",
    year: 2021,
    if: 10.383,
    jcrRanking: "14.202%"
  },
  {
    number: 67,
    authors: "E. J. Lee, K. A. Kuttiyiel*, K. H. Kim, J. Y. Jang, H. J. Lee, J. M. Lee, M. H. Seo, T. H. Yang, S. D. Yim, J. A. Vargas, V. Petkov, K. Sasaki, R. R. Adzic, G. G. Park*",
    title: "High Pressure Nitrogen-Infused Ultrastable Fuel Cell Catalyst for Oxygen Reduction Reaction",
    journal: "ACS Catal.",
    year: 2021,
    if: 13.7,
    jcrRanking: "7.23%",
    specialNote: "Cover letter"
  },
  {
    number: 66,
    authors: "Y. S. Park, Y. S. Noh, J. H. Jeong, M. J. Jang, J. Y. Lee, K. H. Lee, D. C. Lim, M. H. Seo, W. B. Kim*, J. C. Yang*, and S. M. Choi*",
    title: "Commercial anion exchange membrane water electrolyzer stack through non-precious metal electrocatalysts",
    journal: "Appl. Catal. B: Environ.",
    year: 2021,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 65,
    role: "Corresponding",
    authors: "H. S. Han; S. Jin; S. M. Park, S. H. Lee, M. H. Seo*, W. B. Kim*",
    title: "Atomic Iridium Species Anchored on Porous Carbon Network Support: An Outstanding Electrocatalyst for CO2 Conversion to CO",
    journal: "Appl. Catal. B: Environ.",
    year: 2021,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 64,
    role: "First Author",
    authors: "D. C. Dogan†, J. Y Choi†, M. Ho Seo†, E. J. Lee, N. G. Jung*, S. D. Yim, T. H. Yang and G. G. Park*",
    title: "Enhancement of Catalytic Activity and Durability of Pt Nano-particle Through Strong Chemical Interaction with Electrically Conductive Support of Magnéli Phase Titanium Oxide",
    journal: "Nanomaterials",
    year: 2021,
    if: 5.719
  },
  {
    number: 63,
    role: "Corresponding",
    authors: "Z. Xu; S. Jin, M. H. Seo*, Xiaolei Wang*",
    title: "Hierarchical Ni-Mo2C/N-doped carbon Mott-Schottky array for water electrolysis",
    journal: "Appl. Catal. B: Environ.",
    year: 2021,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 62,
    role: "Corresponding",
    authors: "Y. S. Park, J. C. Yang, J. M. Lee, M. J. Jang, J. H. Jeong, W. S. Choi, Y. Yin, M. H. Seo*, Z. Chen*, S. M. Choi*",
    title: "Superior performance of anion exchange membrane water electrolyzer: Ensemble of producing oxygen vacancies and controlling mass transfer resistance",
    journal: "Appl. Catal. B: Environ.",
    year: 2020,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 61,
    role: "Corresponding",
    authors: "Y. S. Park, J. Y. Lee, M. J. Jang, J. C. Yang, J. H. Jeong, W. S. Choi, Y. Yin, M. H. Seo*, Z. Chen*, S. M. Choi*",
    title: "High-performance anion exchange membrane alkaline seawater electrolysis",
    journal: "J. Mater. Chem. A",
    year: 2021,
    if: 14.511,
    jcrRanking: "7.563%",
    specialNote: "Inside cover"
  },
  {
    number: 60,
    role: "Corresponding",
    authors: "H. S. Han, S. Jin, S. M. Park, Y. G. Kim, D. H. Jang, M. H. Seo* and W. B. Kim*",
    title: "Plasma-Induced Oxygen Vacancies in Amorphous MnOx Boost Catalytic Performance for Electrochemical CO2 Reduction",
    journal: "Nano Energy",
    year: 2021,
    if: 19.069,
    jcrRanking: "5.217%"
  },
  {
    number: 59,
    role: "Corresponding",
    authors: "Y. S. Park, J. C. Yang, J. M. Lee, M. J. Jang, J. H. Jeong, W. S. Choi, Y. Yin, M. H. Seo*, Z. Chen*, S. M. Choi*",
    title: "Superior performance of anion exchange membrane water electrolyzer: ensemble of producing oxygen vacancies and controlling mass transfer resistance",
    journal: "Appl. Catal. B: Environ.",
    year: 2020,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 58,
    role: "Corresponding",
    authors: "Y. S. Park, M. J. Jang, J. H. Jeong, S. M. Park, X. Wang, M. H. Seo*, S. M. Choi*, and J. C. Yang*",
    title: "Hierarchical Chestnut-Burr Like Structure of Copper Cobalt Oxide Electrocatalyst Directly Grown on Ni Foam for Anion Exchange Membrane Water Electrolysis",
    journal: "ACS Sustain. Chem. Eng.",
    year: 2020,
    if: 9.224,
    jcrRanking: "9.154%"
  },
  {
    number: 57,
    role: "Corresponding",
    authors: "M. J. Jang, J. C. Yang, J. M. Lee, Y. S. Park, J. H. Jeong S. M. Park, J. Y. Jeong, Y. Yine, M. H. Seo*, S. M. Choi*, K. H. Lee*",
    title: "Superior performance and stability of anion exchange membrane water electrolysis: pH-controlled copper cobalt oxide nanoparticle for oxygen evolution reaction",
    journal: "J. Mater. Chem. A",
    year: 2020,
    if: 14.511,
    jcrRanking: "7.563%",
    specialNote: "Inside cover"
  },
  {
    number: 56,
    role: "Corresponding",
    authors: "J. M. Lee, H. S. Han, S. Jin, S. M. Choi, H. J. Kim, M. H. Seo* and W. B. Kim*",
    title: "A review on recent progress in the aspect of stability of oxygen reduction electrocatalysts for PEM fuel cell: quantum mechanics and experimental approaches",
    journal: "Energy Technology",
    year: 2019,
    if: 4.149
  },
  {
    number: 55,
    authors: "W. Ahn*, M. H. Seo, T. K Pham, Q. H Nguyen, V. T Luu, Y. H. Cho, T. W. Lee, N. C. Cho, and S. K. Jeong",
    title: "High lithium ion transport through rGO wrapped LiNi0. 6Co0. 2Mn0. 2O2 cathode material for high rate capable lithium ion batteries",
    journal: "Front. Chem.",
    year: 2019,
    if: 5.545
  },
  {
    number: 54,
    authors: "Y. S. Park, W. S. Choi, M. J. Jang, J. H. Lee, S. M. Park, H. S. Jin, M. H. Seo, K. H. Lee, Y. Yin, Y. Kim*, J. H. Yang*, and S. M. Choi*",
    title: "A three-dimensional dendritic Cu-Co-P electrode by one-step electrodeposition on a hydrogen bubble template for hydrogen evolution reaction",
    journal: "ACS Sustain. Chem. Eng.",
    year: 2019,
    if: 9.224,
    jcrRanking: "9.154%"
  },
  {
    number: 53,
    role: "Corresponding",
    authors: "D. W. Lee, Y. M. Kim, Y. H. Kwon, J. M. Lee, T. W. Kim, M. H. Seo*, K. S. Kim* and H. J. Kim*",
    title: "Boosting the electrocatalytic glycerol oxidation performance with highly-dispersed Pt nanoclusters loaded on 3D graphene-like microporous carbon",
    journal: "Appl. Catal. B: Environ.",
    year: 2019,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 52,
    role: "First Author",
    authors: "M. H. Seo, M. G. Park, D. U. Lee, X. Wang, W. Ahn, S. H. Noh, S. M. Choi, B. C. Han* and Z. Chen*",
    title: "Understanding the Enhanced Bifunctional Activity and Stability of Oxygen Catalysis by Computational and Experimental Study: Synergistic Effect of Pd nanoparticles and Highly Ordered Mesoporous Co3O4",
    journal: "Appl. Catal. B: Environ.",
    year: 2018,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 51,
    authors: "W. S. Choi, M. J. Jang, K. H. Lee, J. Y. Lee, Y. S. Park, M. H. Seo, and S. M. Choi*",
    title: "Three-Dimensional Honeycomb-Like Cu0.35Co2.65O4 Nanosheet Arrays Supported by Nickel Foam and Their High Efficiency as Oxygen Evolution Electrode",
    journal: "ACS Appl. Mater. Interfaces",
    year: 2018,
    if: 10.383,
    jcrRanking: "14.202%"
  },
  {
    number: 50,
    authors: "S. H. Noh, J. M. Hwang, J. H. Kang, M. H. Seo, D. H. Choi and B. C. Han*",
    title: "Tuning the Catalytic Activity of Heterogeneous Two-dimensional Transition Metal Dichalcogenide for Hydrogen Evolution",
    journal: "J. Mater. Chem. A",
    year: 2018,
    if: 14.511,
    jcrRanking: "7.563%"
  },
  {
    number: 49,
    authors: "X. Wang, G. Li, M. H. Seo, M. Li, A. Yu, and Z. Chen",
    title: "Chemisorption of Polysulfides through Redox Reactions with Organic Molecules for Lithium–Sulfur Batteries",
    journal: "Nat. Commun.",
    year: 2018,
    if: 17.694,
    jcrRanking: "8.219%"
  },
  {
    number: 48,
    authors: "W. Ahn, M. G. Park, D. U. Lee, M. H. Seo, G. Jiang, Z. P. Cano, F. M. Hassan, and Z. Chen",
    title: "Hollow Multivoid Nanocuboids Derived from Ternary Ni–Co–Fe Prussian Blue Analog for Dual-Electrocatalysis of Oxygen and Hydrogen Evolution Reactions",
    journal: "Adv. Funct. Mater.",
    year: 2018,
    if: 18.808,
    jcrRanking: "4.927%"
  },
  {
    number: 47,
    authors: "R. Bose, M. H. Seo, C. Y. Jung and S. C. Yi",
    title: "Comparative investigation of the molybdenum sulphide doped with cobalt and selenium towards hydrogen evolution reaction",
    journal: "Electrochimica Acta",
    year: 2018,
    if: 7.336
  },
  {
    number: 46,
    authors: "G. Li, D. Luo, X. Wang, M. H. Seo, S. Hemmati, A. Yu, and Z. Chen*",
    title: "Enhanced Reversible Sodium‐Ion Intercalation by Synergistic Coupling of Few‐Layered MoS2 and S‐Doped Graphene",
    journal: "Adv. Funct. Mater.",
    year: 2017,
    if: 19.924,
    jcrRanking: "4.927%"
  },
  {
    number: 45,
    authors: "S. Y. Yang, D. J. Seo, M. R. Kim, W. Y. Choi, Y. G. Yoon, M.H. Seo, B.J. Kim, C.Y. Jung, H. S. Kim, B. C. Han, T.Y. Kim",
    title: "Specific approaches to dramatic reduction in stack activation time and perfect long-term storage for high-performance air-breathing polymer electrolyte membrane fuel cell",
    journal: "Int. J. Hydrog. Energy",
    year: 2017,
    if: 7.139,
    jcrRanking: "25.76%"
  },
  {
    number: 44,
    authors: "G. Li, X. Wang, M. H. Seo, S. Hemmat, A. Yu and Z. Chen*",
    title: "Design of Ultralong Single-Crystal Nanowire-Based Bifunctional Electrode for Efficient Oxygen and Hydrogen Evolution in Mild Alkaline Electrolyte",
    journal: "J. Mater. Chem. A",
    year: 2017,
    if: 14.511,
    jcrRanking: "7.563%"
  },
  {
    number: 43,
    role: "Corresponding",
    authors: "S. H. Noh, C. A. Kwon, J. M. Hwang, T. Ohsaka, B. J. Kim, T. Y. Kim, Y. G. Yoon, Z. Chen, B. C. Han* and M. H. Seo*",
    title: "Self-assembled nitrogen doped fullerenes and their catalysis for fuel cell and rechargeable metal-air battery applications",
    journal: "Nanoscale",
    year: 2017,
    if: 8.307,
    jcrRanking: "14.285%",
    specialNote: "Cover letter"
  },
  {
    number: 42,
    authors: "D. U. Lee, J. Li, M. G. Park, M. H. Seo, W. Ahn, I. Stadelmann, L. Ricardez-Sandoval and Z. Chen",
    title: "Self-assembly of Spinel Nano-crystals into Mesoporous Spheres as Bi-functionally Active Oxygen Reduction and Evolution Electrocatalysts",
    journal: "ChemSusChem",
    year: 2017,
    if: 9.14,
    jcrRanking: "16.759%"
  },
  {
    number: 41,
    authors: "X. Wang, G. Li, M. H. Seo, G. Lui, F. M. Hassan, K. Feng, X. Xiao*, and Z. Chen*",
    title: "Carbon-Coated Silicon Nanowires on Carbon Fabric as Self-Supported Electrodes for Flexible Lithium-Ion Batteries",
    journal: "ACS Appl. Mater. Interfaces",
    year: 2016,
    if: 10.383,
    jcrRanking: "14.202%"
  },
  {
    number: 40,
    authors: "S. Y. Yang, D. J. Seo, M, R. Kim, M. H. Seo, S. M. Hwang, Y. M. Jung, B. J. Kim, Y. G. Yoon, B. C, Han, T. Y. Kim",
    title: "Fast stack activation procedure and effective long-term storage for high-performance polymer electrolyte membrane fuel cell",
    journal: "J. Power Sources",
    year: 2016,
    if: 9.794,
    jcrRanking: "13.333%"
  },
  {
    number: 39,
    authors: "S. H. Noh, M. H. Seo, J. H. Kang, T. Okajima, B. C. Han, and T. Ohsaka",
    title: "Towards a comprehensive understanding of FeCo coated with N-doped carbon as a stable bi-functional catalyst in acidic media",
    journal: "NPG Asia Materials",
    year: 2016,
    if: 10.761,
    jcrRanking: "13.043%"
  },
  {
    number: 38,
    authors: "J. S. Seo, D. Y. Kim, S. M. Hwang, M. H. Seo, D. J. Seo, S. Y. Yang, C. H. Han, Y. M. Jung, H. U. Guim, K. S. Nahm, Y. G. Yoon, T. Y. Kim",
    title: "Degradation of polymer electrolyte membrane fuel cell by siloxane in biogas",
    journal: "J. Power Sources",
    year: 2016,
    if: 9.794,
    jcrRanking: "13.333%"
  },
  {
    number: 37,
    authors: "M. G. Park, D. U. Lee, M. H. Seo, Z. Paul Cano, and Z. Chen",
    title: "3D Ordered Mesoporous Bifunctional Oxygen Catalyst for Electrically Rechargeable Zinc-Air Batteries",
    journal: "Small",
    year: 2016,
    if: 15.153,
    jcrRanking: "6.832%"
  },
  {
    number: 36,
    authors: "W. Ahn, M. H. Seo, Y. S. Jun, D. U. Lee, F. M. Hassan, X. Wang, A. Yu, and Z. Chen",
    title: "Sulfur Nanogranular Film-Coated Three-Dimensional Graphene Sponge-Based High Power Lithium Sulfur Battery",
    journal: "ACS Applied Materials & Interfaces",
    year: 2016,
    if: 8.758,
    jcrRanking: "14.202%"
  },
  {
    number: 35,
    authors: "M. A. Hoque, D. C. Higgins, M. H. Seo, F. Hassan, J. Y. Choi, M. Pritzker and Z. Chen*",
    title: "Optimization of sulfur-doped graphene as an emerging platinum nanowires support for oxygen reduction reaction",
    journal: "Nano Energy",
    year: 2015,
    if: 17.881,
    jcrRanking: "4.45%"
  },
  {
    number: 34,
    role: "First Author",
    authors: "M. H. Seo, S. M. Choi, D. U. Lee, W. B. Kim and Z. Chen",
    title: "Correlation between theoretical descriptor and catalytic oxygen reduction activity of graphene supported Pd and Pd3X (X=Ag, Fe and Co) electrocatalysts",
    journal: "J. Power Sources",
    year: 2015,
    if: 9.794,
    jcrRanking: "13.333%"
  },
  {
    number: 33,
    authors: "D. U. Lee, M. G. Park, H. W. Park, M. H Seo, V. Ismayilov, R. Ahmed and Z. Chen",
    title: "Highly active Co-doped LaMnO3 perovskite oxide and N-doped carbon nanotube hybrid bi-functional catalyst for rechargeable zinc–air batteries",
    journal: "Electrochem. Commun.",
    year: 2015,
    if: 5.443
  },
  {
    number: 32,
    authors: "D. U. Lee, M. G. Park, M. H Seo, and Z. Chen",
    title: "Highly active and durable nanocrystal decorated hybrid bi-functional electrocatalyst for rechargeable zinc-air batteries",
    journal: "ChemSusChem",
    year: 2015,
    if: 9.14,
    jcrRanking: "16.759%"
  },
  {
    number: 31,
    authors: "S. H, Noh, M. H. Seo, X. Ye, Y. Makinose, T. Okajima, N. Matsushita, B. C. Han* and T, Ohsaka*",
    title: "Design of Active and Durable Catalyst for Oxygen Reduction Reaction Using Encapsulated Cu with N-Doped Carbon Shells (Cu@N-C) Activated by CO2 Treatment",
    journal: "J. Mater. Chem. A",
    year: 2015,
    if: 14.511,
    jcrRanking: "7.563%"
  },
  {
    number: 30,
    authors: "X. Wang, G. Li, M. H. Seo, F.M. Hassan, M. A. Hoque, Z. Chen",
    title: "Sulfur Atoms Bridging Few-layered MoS2 with S-doped Graphene Enables Highly Robust Anode for Lithium-ion Batteries.",
    journal: "Adv. Energy Mater.",
    year: 2015,
    if: 21.687,
    jcrRanking: "2.83%"
  },
  {
    number: 29,
    role: "First Author",
    authors: "M. H. Seo, H. W. Park, D. U. Lee, M. G. Park and Z. Chen",
    title: "Design of highly active perovskite oxides for oxygen evolution reaction combining experimental and ab-initio studies",
    journal: "ACS Catal.",
    year: 2015,
    if: 13.7,
    jcrRanking: "7.23%"
  },
  {
    number: 28,
    authors: "Y. Noh, Y. Kim, S. Lee, E. J. Lim, J. G. Kim, S. M. Choi, M. H. Seo, and W. B. Kim*",
    title: "Exploring the effects of the size of reduced graphene oxide nanosheets for Pt-catalyzed electrode reactions",
    journal: "Nanoscale",
    year: 2015,
    if: 8.307,
    jcrRanking: "14.285%"
  },
  {
    number: 27,
    authors: "D. Higgins, F. M Hassan, M. H. Seo, J. Y. Choi, M. A. Hoque, D. U. Lee, Z. Chen",
    title: "Shape-controlled octahedral cobalt disulfide nanoparticles supported on nitrogen and sulfur-doped graphene/carbon nanotube composites for oxygen reduction in acidic electrolyte",
    journal: "J. Mater. Chem. A",
    year: 2015,
    if: 14.511,
    jcrRanking: "7.563%"
  },
  {
    number: 26,
    authors: "H. W. Park, D. U. Lee, M. G. Park, R. A., M. H. Seo, L. F. Nazar, Z. Chen",
    title: "Perovskite–Nitrogen-Doped Carbon Nanotube Composite as Bifunctional Catalysts for Rechargeable Lithium–Air Batteries",
    journal: "ChemSusChem",
    year: 2015,
    if: 9.14,
    jcrRanking: "16.759%"
  },
  {
    number: 25,
    authors: "H. W. Park, D. U. Lee, P. Zamani, M. H. Seo., L. F. Nazar and Z. Chen",
    title: "Electrospun Porous Nanorod Perovskite Oxide/Nitrogen-Doped Graphene Composite as a Bi-fuctional Catalyst for Metal Air Batteries.",
    journal: "Nano energy",
    year: 2014,
    if: 17.881,
    jcrRanking: "4.45%"
  },
  {
    number: 24,
    role: "First Author",
    authors: "M. H. Seo, D. Higgins, G. Jiang, S. M. Choi, B. Han and Z. Chen",
    title: "The theoretical insights into highly durable iron phthalocyanine derived non-precious catalyst for oxygen reduction reaction.",
    journal: "J. Mater. Chem. A",
    year: 2014,
    if: 14.511,
    jcrRanking: "7.563%"
  },
  {
    number: 23,
    authors: "D. C. Higgins, M. A. Hoque, M. H. Seo, R. Wang, F. Hassan, J. Y. Choi, M. Pritzker, A. Yu , J. Zhang, and Z. W. Chen",
    title: "Development and Simulation of Sulfur-doped Graphene Supported Platinum with Exemplary Stability and Activity Towards Oxygen Reduction.",
    journal: "Adv. Funct. Mater.",
    year: 2014,
    if: 19.924,
    jcrRanking: "4.927%",
    specialNote: "Cover letter"
  },
  {
    number: 22,
    role: "First Author",
    authors: "M. H. Seo, S. M. Choi, E. J. Lim, I. H. Kwon, J. K. Seo, S. H. Noh, W. B. Kim, and B. Han",
    title: "Toward new support materials in fuel cell: the theoretical and experimental study of the nitrogen doped graphene.",
    journal: "ChemSusChem",
    year: 2014,
    if: 9.14,
    jcrRanking: "16.759%"
  },
  {
    number: 21,
    authors: "S. H. Noh, D. H. Kwak, M. H. Seo, T. Ohsaka and B. Han.",
    title: "First principles study of oxygen reduction reaction mechanisms on N-doped graphene with a transition metal support",
    journal: "Electrochimica Acta",
    year: 2014,
    if: 7.336
  },
  {
    number: 20,
    role: "First Author",
    authors: "M. H. Seo, S. M. Choi, J. K. Seo, S. H. Noh, W. B. Kim and B. C. Han",
    title: "The graphene-supported palladium and palladium-yttrium nanoparticles for the oxygen reduction and ethanol oxidation reactions: Experimental measurement and Computational validation",
    journal: "Appl. Catal. B-Enviro",
    year: 2013,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 19,
    authors: "S. H. Noh, M. H. Seo, J. K. Seo, P. Fischer and B. C. Han",
    title: "First principles computational study on the electrochemical stability of Pt-Co nanocatalysts",
    journal: "Nanoscale",
    year: 2013,
    if: 8.307,
    jcrRanking: "14.285%"
  },
  {
    number: 18,
    authors: "J. K. Seo, A. Khetan, M. H. Seo, H. S. Kim and B.C. Han",
    title: "First-principles investigation on the electrochemical dissolution process of Pt nanocatalysts in fuel cell applications",
    journal: "J. Power Sources",
    year: 2013,
    if: 9.794,
    jcrRanking: "13.333%"
  },
  {
    number: 17,
    authors: "E. J. Lim, S. M. Choi, M. H. Seo, Y. Kim, S. Lee, and W. B. Kim",
    title: "Highly dispersed Ag nanoparticles on nanosheets of reduced graphene oxide for oxygen reduction reaction in alkaline media",
    journal: "Electrochem. Commun.",
    year: 2013,
    if: 5.443,
    specialNote: "Highlighted in Renewable Energy Global Innovations"
  },
  {
    number: 16,
    authors: "Y. M. Kim, H. J. Kim, Y. S. Kim, S. M. Choi, M. H. Seo, and W. B. Kim",
    title: "Shape- and Composition-Sensitive Activity of Pt and PtAu Catalysts for Formic Acid Electrooxidation",
    journal: "J. Phys. Chem. C",
    year: 2012,
    if: 4.177
  },
  {
    number: 15,
    authors: "S. H. Lee, H. J. Kim, S. M. Choi, M. H. Seo, and W. B. Kim",
    title: "The promotional effect of Ni on bimetallic PtNi/C catalysts for glycerol electrooxidation",
    journal: "Appl. Catal. A-Gen",
    year: 2012,
    if: 5.723
  },
  {
    number: 14,
    authors: "S. M. Choi, M. H. Seo, H. J. Kim, and W. B. Kim",
    title: "Synthesis and characterization of graphene-supported metal nanoparticles by impregnation method with heat treatment",
    journal: "Synth. Met.",
    year: 2011,
    if: 4.00
  },
  {
    number: 13,
    authors: "H. J. Kim, S. M. Choi, M. H. Seo, S. Green, G. W. Huber, and W. B. Kim",
    title: "Efficient electrooxidation of biomass-derived glycerol over a graphene-supported PtRu electrocatalyst",
    journal: "Electrochem. Commun.",
    year: 2011,
    if: 5.443
  },
  {
    number: 12,
    role: "First Author",
    authors: "M. H. Seo, E. J. Lim, S. M. Choi, S. H. Ham, H. J. Kim, and W. B. Kim",
    title: "Synthesis, characterization, and electrocatalytic properties of a polypyrrole-composited Pd/C catalyst",
    journal: "Int. J. Hydrog. Energy",
    year: 2011,
    if: 7.139
  },
  {
    number: 11,
    authors: "S. M. Choi, M. H. Seo, H. J. Kim, and W. B. Kim",
    title: "Synthesis of surface-functionalized graphene nanosheets with high Pt-loadings and their applications to methanol electrooxidation",
    journal: "Carbon",
    year: 2011,
    if: 11.307
  },
  {
    number: 10,
    role: "First Author",
    authors: "M. H. Seo, S. M. Choi, H. J. Kim, and W. B. Kim",
    title: "The graphene-supported Pd and Pt catalysts for highly active oxygen reduction reaction in an alkaline condition",
    journal: "Electrochem. Commun.",
    year: 2011,
    if: 5.443
  },
  {
    number: 9,
    role: "First Author",
    authors: "M. H. Seo, E. J. Lim, S. M. Choi, H. J. Kim, and W. B. Kim",
    title: "Stability enhancement of Pd catalysts by compositing with polypyrrole layer for polymer electrolyte fuel cell electrodes",
    journal: "Top. Catal",
    year: 2010,
    if: 2.781
  },
  {
    number: 8,
    authors: "S. M. Choi, M. H. Seo, H. J. Kim, E. J. Lim, and W. B. Kim",
    title: "Effect of polyoxometalate amount deposited on Pt/C electrocatalysts for CO tolerant electrooxidation of H2 in polymer electrolyte fuel cells",
    journal: "Int. J. Hydrog. Energy",
    year: 2010,
    if: 7.139
  },
  {
    number: 7,
    authors: "H. J. Kim, Y. S. Kim, M. H. Seo, S. M. Choi, J. M. Cho, G. W. Huber and W. B. Kim",
    title: "Highly improved oxygen reduction performance over Pt/C-dispersed nanowire network catalysts",
    journal: "Electrochem. Commun.",
    year: 2010,
    if: 5.443
  },
  {
    number: 6,
    authors: "S. M. Choi, J. S. Yoon, H. J. Kim, S. H. Nam, M. H. Seo, and W. B. Kim",
    title: "Electrochemical benzene hydrogenation using PtRhM/C (M = W, Pd, or Mo) electrocatalysts over polymer electrolyte fuel cell system.",
    journal: "Appl. Catal. A-Gen",
    year: 2009,
    if: 5.443
  },
  {
    number: 5,
    authors: "H. J. Kim, Y. S. Kim, M. H. Seo, S. M. Choi and W. B. Kim",
    title: "Pt and PtRh nanowire electrocatalysts for cyclohexane fueled polymer electrolyte membrane fuel cell.",
    journal: "Electrochem. Commun.",
    year: 2009,
    if: 5.443
  },
  {
    number: 4,
    authors: "H. J. Kim, S. M. Choi, S. H. Nam, M. H. Seo and W. B. Kim",
    title: "Carbon supported PtNi catalysts for electrooxidation of cyclohexane to benzene over polymer electrolyte fuel cells.",
    journal: "Catal. Today",
    year: 2009,
    if: 6.776
  },
  {
    number: 3,
    authors: "H. J. Kim, S. M. Choi, S. H. Nam, M. H. Seo and W. B. Kim",
    title: "Effect of Rh content on PtRh/C catalysts for dehydrogenative electrooxidation of cyclohexane to benzene over polymer electrolyte membrane fuel cell.",
    journal: "Appl. Catal. A-Gen",
    year: 2009,
    if: 5.443
  },
  {
    number: 2,
    authors: "J. H. Kim, S. M. Choi, S. H. Nam, M. H. Seo, S. H. Choi and W. B. Kim",
    title: "Influence of Sn content on PtSn/C catalysts for electrooxidation of C1 - C3 alcohols: synthesis, characterization, and electrocatalytic activity.",
    journal: "Appl. Catal. B-Enviro",
    year: 2008,
    if: 24.319,
    jcrRanking: "1.851%"
  },
  {
    number: 1,
    role: "First Author",
    authors: "M. H. Seo, S. M. Choi, H. J. Kim, J. H. Kim, B. K. Cho and W. B. Kim",
    title: "A polyoxometalate-deposited Pt/CNTs electrocatalyst via chemical synthesis for methanol electrooxidation.",
    journal: "J. Power Sources",
    year: 2008,
    if: 9.794,
    jcrRanking: "13.333%"
  }
];

// 최근 논문만 가져오기 (홈페이지용)
export const recentPublications = publications.slice(0, 6);

