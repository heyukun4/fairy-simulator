class CultivationGame {
  constructor() {
    this.player = {
      name: '未定',
      level: '练气期',
      spiritual: 0,
      physical: 0,
      wisdom: 0,
      luck: 0
    };
    
    this.levels = [
      '练气期', '筑基期', '金丹期', '元婴期',
      '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'
    ];
    
    this.sects = [
      {name: '青云门', bonus: {spiritual: 200, wisdom: 100, physical: 50}},
      {name: '蜀山剑派', bonus: {spiritual: 150, physical: 150, luck: 50}},
      {name: '昆仑派', bonus: {wisdom: 200, spiritual: 100, luck: 50}},
      {name: '天音寺', bonus: {wisdom: 250, spiritual: 100}},
      {name: '丹鼎宗', bonus: {spiritual: 300, luck: 50}},
      {name: '百花谷', bonus: {luck: 200, wisdom: 150}}
    ];
    
    this.events = [
      {name: '发现上古遗迹', bonus: {spiritual: 500, wisdom: 200}, probability: 0.1},
      {name: '获得传承玉简', bonus: {wisdom: 400, spiritual: 200}, probability: 0.15},
      {name: '击杀妖兽', bonus: {physical: 300, spiritual: 200}, probability: 0.2},
      {name: '得到天材地宝', bonus: {spiritual: 400, luck: 100}, probability: 0.2},
      {name: '参悟天道', bonus: {wisdom: 500, spiritual: 300}, probability: 0.05},
      {name: '历练成功', bonus: {physical: 200, spiritual: 200}, probability: 0.3},
      {name: '获得仙缘', bonus: {spiritual: 1000, wisdom: 500, luck: 200}, probability: 0.01},
      {name: '发现秘境', bonus: {spiritual: 800, physical: 300, wisdom: 300}, probability: 0.05}
    ];
    
    this.currentSect = null;
    this.bindEvents();
  }
  
  bindEvents() {
    $('#initCharacter').click(() => this.showInitModal());
    $('#confirmInit').click(() => this.initCharacter());
    $('#explore').click(() => this.explore());
    $('#cultivate').click(() => this.cultivate());
    $('#joinSect').click(() => this.joinSect());
  }
  
  showInitModal() {
    $('#initModal').show();
  }
  
  initCharacter() {
    this.player.name = $('#nameInput').val() || '无名修士';
    this.player.spiritual = parseInt($('#spiritualInput').val()) || 0;
    this.player.physical = parseInt($('#physicalInput').val()) || 0;
    this.player.wisdom = parseInt($('#wisdomInput').val()) || 0;
    this.player.luck = parseInt($('#luckInput').val()) || 0;
    
    this.updateUI();
    $('#initModal').hide();
    this.log(`修士${this.player.name}踏上修仙之路。`);
  }
  
  explore() {
    const roll = Math.random() * (1 + this.player.luck / 1000);
    let foundEvent = null;
    
    for (const event of this.events) {
      if (roll <= event.probability) {
        foundEvent = event;
        break;
      }
    }
    
    if (foundEvent) {
      this.log(`机缘巧合下遇到：${foundEvent.name}！`);
      
      Object.entries(foundEvent.bonus).forEach(([stat, value]) => {
        const actualBonus = Math.floor(value * (1 + this.player.luck / 1000));
        this.player[stat] += actualBonus;
        this.log(`${stat === 'spiritual' ? '灵力' : 
                 stat === 'physical' ? '体质' : 
                 stat === 'wisdom' ? '悟性' : '机缘'} 提升${actualBonus}点！`);
      });
      
      this.updateUI();
    } else {
      this.log('这次探索并未发现什么特别的。');
    }
    this.checkLevelUp();
  }
  
  cultivate() {
    const base = 50;
    const wisdom_bonus = this.player.wisdom / 100;
    const sect_bonus = this.currentSect ? 0.5 : 0;
    const gain = Math.floor(base * (1 + wisdom_bonus + sect_bonus));
    
    this.player.spiritual += gain;
    this.log(`闭关修炼，灵力提升${gain}点。`);
    this.updateUI();
    this.checkLevelUp();
  }
  
  joinSect() {
    if (this.currentSect) {
      this.log('你已经加入了宗门，不能叛门投向其他宗门。');
      return;
    }
    
    const sect = this.sects[Math.floor(Math.random() * this.sects.length)];
    this.currentSect = sect;
    
    Object.entries(sect.bonus).forEach(([stat, value]) => {
      this.player[stat] += value;
      this.log(`获得${sect.name}加持，${stat}提升${value}点！`);
    });
    
    $('#sect').text(sect.name);
    this.log(`成功加入${sect.name}！获得宗门传承。`);
    this.updateUI();
  }
  
  checkLevelUp() {
    const currentIndex = this.levels.indexOf(this.player.level);
    const threshold = (currentIndex + 1) * 1000;
    
    if (this.player.spiritual >= threshold && currentIndex < this.levels.length - 1) {
      this.player.level = this.levels[currentIndex + 1];
      this.log(`突破成功！境界提升至${this.player.level}！`);
      this.updateUI();
    }
  }
  
  log(message) {
    const time = new Date().toLocaleTimeString();
    $('#gameLog').prepend(`<p>[${time}] ${message}</p>`);
  }
  
  updateUI() {
    $('#playerName').text(this.player.name);
    $('#level').text(this.player.level);
    $('#spiritual').text(this.player.spiritual);
    $('#physical').text(this.player.physical);
    $('#wisdom').text(this.player.wisdom);
    $('#luck').text(this.player.luck);
  }
}

$(document).ready(() => {
  window.game = new CultivationGame();
});
