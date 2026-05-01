const API = 'http://localhost:6060/api';

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('watcherCheck', { periodInMinutes: 30 });
  chrome.contextMenus.create({
    id: 'watcherTrack',
    title: 'WATCHER — Track This Page',
    contexts: ['page', 'link']
  });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'watcherCheck') {
    try {
      const res = await fetch(`${API}/changes/recent`);
      const changes = await res.json();
      if (changes && changes.length > 0) {
        chrome.action.setBadgeText({ text: String(changes.length) });
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
      } else {
        chrome.action.setBadgeText({ text: '' });
      }
    } catch (e) {
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
    }
  }
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'watcherTrack') {
    chrome.storage.local.set({
      pendingTrackUrl: info.linkUrl || info.pageUrl
    });
  }
});