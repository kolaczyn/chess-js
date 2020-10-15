// manages notifications
class Notifications {
  constructor() {
    this.notificationsCount = 1;
    this.notificationsBody = document.getElementById("notifications-body");
    this.clearNotificationsBtn = document.getElementById(
      "clear-notifications-btn"
    );
    this.clearNotificationsBtn.addEventListener("click", () =>
      this.clearNotifications()
    );
  }
  clearNotifications() {
    // this.notificationsBody.innerHTML = "";
    // console.log(this)
    this.notificationsBody.innerHTML = "";
  }
  sendNotification(message, severity) {
    let messageWrapper = document.createElement("p");
    let hr = document.createElement("hr");
    let messageElement = document.createTextNode(
      `${this.notificationsCount++}. ${message}`
    );
    messageWrapper.appendChild(messageElement);
    messageWrapper.appendChild(hr);
    messageWrapper.classList.add(severity);
    // notificationsBody.appendChild(messageWrapper)
    this.notificationsBody.insertBefore(
      messageWrapper,
      this.notificationsBody.firstChild
    );
  }
}
