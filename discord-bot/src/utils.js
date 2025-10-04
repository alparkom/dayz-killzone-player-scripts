function ParseKillData(message) {
  if (message.includes(" fallecido.")) {
    const victimName = message.replace(" fallecido.", "")

    return {
      distance: null,
      killerName: null,
      victimName,
      weaponName: null,
      reason: "unknown"
    }
  }

  if (message.includes(" fue matado por ") && !message.includes(" fue matado por Zombie.")) {
    const regex = /^(.+?) fue matado por (.+?) con (.+?) desde (\d+) metros\./;
    const match = message.match(regex);

    if (!match) {
      return {
        distance: null,
        killerName: null,
        victimName: null,
        weaponName: null,
        reason: null,
      };
    }

    const [, victimName, killerName, weaponName, distance] = match;

    return {
      distance: parseInt(distance, 10),
      killerName: killerName.trim(),
      victimName: victimName.trim(),
      weaponName: weaponName.trim(),
      reason: "murder-by-player"
    };
  }

  if (message.includes(" fue matado por ") && message.includes(" fue matado por Zombie.")) {
    const victimName = message.replace(" fue matado por Zombie.", "")

    return {
      distance: null,
      killerName: null,
      victimName,
      weaponName: null,
      reason: "murder-by-zombie"
    }
  }

  if (message.includes(" Se suicidó.")) {
    const victimName = message.replace(" Se suicidó.", "")

    return {
      distance: null,
      killerName: null,
      victimName,
      weaponName: null,
      reason: "suicide"
    }
  }

  if (message.includes(" died dehydrated.")) {
    const victimName = message.replace(" died dehydrated.", "")

    return {
      distance: null,
      killerName: null,
      victimName,
      weaponName: null,
      reason: "dehydrated"
    }
  }

  if (message.includes(" Asesinado por ") && !message.includes(" con ")) {
    const regex = /^(.+?) Asesinado por (.+?)\.$/;
    const match = message.match(regex);

    if (!match) {
      return {
        distance: null,
        killerName: null,
        victimName: null,
        weaponName: null,
        reason: null,
      };
    }

    const [, victimName, variableText] = match;
    const possibleWeapons = [
      "EGD-5 Frag Grenade",
      "Land Mine",
      "Claymore",
    ]
    const possibleAnimals = [
      "Wolf",
    ]
    const variableTextIsWeapon = possibleWeapons.some((val) => val.toLowerCase() === variableText.toLowerCase())
    const variableTextIsAnimal = possibleAnimals.some((val) => val.toLowerCase() === variableText.toLowerCase())
    const variableTextIsPlayer = !variableTextIsWeapon && !variableTextIsAnimal

    let reason = "unknown"

    if (variableTextIsAnimal) {
      reason = "murder-by-animal"
    } else if (variableTextIsPlayer) {
      reason = "murder-by-player"
    } else if (variableTextIsWeapon) {
      reason = "died-by-weapon"
    }

    return {
      distance: null,
      killerName: variableTextIsPlayer || variableTextIsAnimal ? variableText.trim() : null,
      victimName: victimName.trim(),
      weaponName: variableTextIsWeapon ? variableText.trim() : null,
      reason
    };
  }

  if (message.includes(" Asesinado por ") && message.includes(" con ")) {
    const regex = /^(.+?) Asesinado por (.+?) con (.+?)\.$/;
    const match = message.match(regex);

    if (!match) {
      return {
        distance: null,
        killerName: null,
        victimName: null,
        weaponName: null,
        reason: null
      };
    }

    const [, victimName, killerName, weaponName] = match;

    return {
      distance: null,
      killerName: killerName.trim(),
      victimName: victimName.trim(),
      weaponName: weaponName.trim(),
      reason: "murder-by-player",
    };
  }

  if (message.includes(" murió de hambre.")) {
    const victimName = message.replace(" murió de hambre.", "")

    return {
      distance: null,
      killerName: null,
      victimName,
      weaponName: null,
      reason: "inanition"
    }
  }

  if (message.includes(" killed by ") && message.includes(" with ")) {
    const regex = /^(.+?) killed by (.+?) with (.+?)\.$/;
    const match = message.match(regex);

    if (!match) {
      return {
        distance: null,
        killerName: null,
        victimName: null,
        weaponName: null,
        reason: null,
      };
    }

    const [, victimName, killerName, weaponName] = match;

    return {
      distance: null,
      killerName: killerName.trim(),
      victimName: victimName.trim(),
      weaponName: weaponName.trim(),
      reason: "murder-by-player",
    };
  }

  return null
}

module.exports = {
  ParseKillData
}