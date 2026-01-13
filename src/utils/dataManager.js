const fs = require('fs').promises;
const path = require('path');

class DataManager {
  constructor(filePath) {
    this.filePath = path.join(__dirname, filePath);
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, create it with empty array
      if (error.code === 'ENOENT') {
        await this.saveData([]);
        return [];
      }
      throw error;
    }
  }

  async saveData(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    return await this.readData();
  }

  async getById(id) {
    const data = await this.readData();
    return data.find(item => item.id === id);
  }

  async create(item) {
    const data = await this.readData();
    data.push(item);
    await this.saveData(data);
    return item;
  }

  async update(id, updatedItem) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    data[index] = { ...data[index], ...updatedItem };
    await this.saveData(data);
    return data[index];
  }

  async delete(id) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    data.splice(index, 1);
    await this.saveData(data);
    return true;
  }
}

module.exports = DataManager;