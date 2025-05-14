const raceSelect = document.getElementById("raceSelect");
const generateBtn = document.getElementById("generateBtn");
const classSelect = document.getElementById("classSelect");
const characterOutput = document.getElementById("characterOutput");

// 👇 BASE URL for API
const BASE_URL = "https://www.dnd5eapi.co/api";

// 👇 Hent liste over raser og klasser
async function fetchOptions() {
  try {
    // Hent raser
    const raceRes = await fetch(`${BASE_URL}/races`);
    const raceData = await raceRes.json();

    // Legg til raser i raceSelect som <option>
    raceData.results.forEach((race) => {
      const option = document.createElement("option");
      option.value = race.index;
      option.textContent = race.name;
      raceSelect.appendChild(option);
    });

    // Hent klasser
    const classRes = await fetch(`${BASE_URL}/classes`);
    const classData = await classRes.json();

    // Legg til klasser i classSelect som <option>
    classData.results.forEach((classObj) => {
      const option = document.createElement("option");
      option.value = classObj.index;
      option.textContent = classObj.name;
      classSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Feil ved henting av data:", error);
  }
}


generateBtn.addEventListener("click", async () => {
  const selectedRace = raceSelect.value;
  const selectedClass = classSelect.value;

  if (!selectedRace || !selectedClass) {
    alert("Choose both a race and class!");
    return;
  }

  try {
    // Henter detaljer om valgt rase
    const raceDetailsRes = await fetch(`${BASE_URL}/races/${selectedRace}`);
    const raceDetails = await raceDetailsRes.json();

    // Henter detaljer om valgt klasse
    const classDetailsRes = await fetch(`${BASE_URL}/classes/${selectedClass}`);
    const classDetails = await classDetailsRes.json();

    // 👇 Henter spells for selected class
    const classSpellsRes = await fetch(`${BASE_URL}/classes/${selectedClass}/spells`);
    const classSpells = await classSpellsRes.json();

    // Limit the number of spells to 3-5
    const limitedSpells = classSpells.results ? classSpells.results.slice(0, 5) : []; // Henter de første 5 spells
    let spellsOutput = "";

    if (limitedSpells.length > 0) {
      const spellsList = limitedSpells.map((spell) => spell.name).join(', ');
      spellsOutput = `<p>Spells: ${spellsList}</p>`;  // Display spells
    } else {
      // sjekker for andre attacks om karakter ikke har spells
      const classFeatures = classDetails.class_features || [];
      let abilitiesOutput = "Abilities: ";

      if (classFeatures.length > 0) {
        
        abilitiesOutput += classFeatures[0].name;  
      } else {
        abilitiesOutput = "No spells or special abilities available.";
      }

      spellsOutput = `<p>${abilitiesOutput}</p>`; // Viser abilities om det ikke er noen spells
    }

    // Vis data i DOM
    characterOutput.innerHTML = `
      <h2>Character</h2>
      <p>Race: ${raceDetails.name}</p>
      <p>Class: ${classDetails.name}</p>
      <p>Speed: ${raceDetails.speed}</p>
      ${spellsOutput} <!-- This will be either spells or abilities -->
    `;
  } catch (error) {
    console.error("Something went wrong when creating character:", error);
  }
});

fetchOptions();
