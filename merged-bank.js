const fs = require('fs').promises;

async function mergedBanks() {
  const file1 = JSON.parse(await fs.readFile('paste1_bank.txt', 'utf8'));
  const file2 = JSON.parse(await fs.readFile('paste2_bank.txt', 'utf8'));

  const bankMap = new Map();

  file1.forEach((bank) => {
    bankMap.set(bank.name.toLowerCase(), {
      name: bank.name,
      slug: bank.slug || '',
      code: bank.code,
      ussd: bank.ussd || '',
      logo: bank.logo || 'https://nigerianbanks.xyz/logo/default-image.png',
      bank_value: bank.bank_value || bank.code,
    });
  });

  file2.forEach((bank) => {
    const lowerName = bank.name.toLowerCase();
    if (!bankMap.has(lowerName)) {
      const slug = bank.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      bankMap.set(lowerName, {
        name: bank.name,
        slug: slug,
        code: bank.code,
        ussd: '',
        logo: bank.logo || 'https://nigerianbanks.xyz/logo/default-image.png',
        bank_value: bank.bank_value || bank.code,
      });
    }
  });

  const mergedBanks = [...bankMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  console.log('Total number of unique banks:', mergedBanks.length);
  console.log('\nFirst few entries:', mergedBanks.slice(0, 3));

  await fs.writeFile(
    'supported_banks.json',
    JSON.stringify(mergedBanks, null, 2)
  );
}

mergedBanks().catch(console.error);
