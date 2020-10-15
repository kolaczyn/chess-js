// manages turn indicator
class TurnIndicator {
  constructor() {
    this.whitesTurnIndicator = document.getElementById("whites-turn");
    this.blacksTurnIndicator = document.getElementById("blacks-turn");
  }

  changeTurnIndicators() {
    this.whitesTurnIndicator.classList.toggle("hidden");
    this.blacksTurnIndicator.classList.toggle("hidden");
  }
}
