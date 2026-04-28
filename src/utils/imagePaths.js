export const liteImageMapping = {
  'doisdois_casa_serradaneblina_studiocata_01-300dpi.jpg': '716762d0dbeb4e28bd0f741482fe4842.jpg',
  'doisdois_casa_serradaneblina_studiocata_01.jpg': 'debf4ec742e84fcf9f96a0cfc1016931.jpg',
  'doisdois_casa_serradaneblina_studiocata_02-300dpi.jpg': '00889d219e624a9cae0b004046706109.jpg',
  'doisdois_casa_serradaneblina_studiocata_02_01.jpg': '97ba4d45c500465fa38d172dac9edcc3.jpg',
  'doisdois_casa_serradaneblina_studiocata_02.jpg': '43c23876ed654bc0965abfc64abd8fc1.jpg',
  'doisdois_casa_serradaneblina_studiocata_02_02.jpg': 'c691a1899a644352bd0954d16416ab16.jpg',
};

export function convertToLitePath(originalPath) {
  if (originalPath.includes('/lite/')) {
    return originalPath;
  }

  if (!originalPath.includes('/projetos/')) {
    return originalPath;
  }

  const pathParts = originalPath.split('/');
  const fileName = pathParts.pop();
  const liteFileName = liteImageMapping[fileName];

  return liteFileName ? `${pathParts.join('/')}/lite/${liteFileName}` : originalPath;
}

export function convertToOriginalPath(litePath) {
  if (!litePath.includes('/lite/')) {
    return litePath;
  }

  const pathParts = litePath.split('/');
  const liteFileName = pathParts.pop();
  const originalName = Object.entries(liteImageMapping).find(([, mappedName]) => mappedName === liteFileName)?.[0];

  if (!originalName) {
    return litePath;
  }

  if (pathParts[pathParts.length - 1] === 'lite') {
    pathParts.pop();
  }

  return `${pathParts.join('/')}/${originalName}`;
}
