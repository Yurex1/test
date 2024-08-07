const fs = require("node:fs/promises");

async function readFile() {
    try {
        const data = await fs.readFile('/Users/Юрец/Desktop/Near/result.txt', 'utf8');
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

async function main() {
    try {
        // Зчитування та розпарсування даних
        const rawData = await readFile();
        // Розбиваємо дані на окремі об'єкти
        const dataArray = rawData
            .split('}{')
            .map((str, index) => {
                if (index !== 0) str = `{${str}`;
                if (index !== rawData.split('}{').length - 1) str = `${str}}`;
                return str;
            })
            .filter(Boolean) // Видаляє пусті рядки
            .map(JSON.parse); // Розпарсує рядки у об'єкти

        // Сортуємо дані за властивістю balanceInNear
        const sortedData = dataArray.sort((a, b) => b.balanceInNear - a.balanceInNear);

        // Виводимо результат
        await fs.writeFile('/Users/Юрец/Desktop/Near/sorted.txt', JSON.stringify(sortedData, null, 2))
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
