function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const targetTop = rect.top + scrollTop;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  }
}

function generateConversationButtons() {
  const unsolvedConversations = [
    ...document.querySelectorAll('details[data-resolved="false"]')
  ];

  if (unsolvedConversations.length === 0) {
    const noUnresolvedButton = document.getElementById('no-unresolved-button');
    if (noUnresolvedButton) {
      noUnresolvedButton.disabled = true;
      noUnresolvedButton.innerHTML = 'No unresolved conversation exists';
    }
    return;
  }

  const buttons = unsolvedConversations.map(conversation => {
    const turboFrameId = conversation.closest('turbo-frame').id;
    const button = document.createElement('button');
    button.innerHTML = turboFrameId;
    button.onclick = () => {
      scrollToElement(turboFrameId);
    };
    button.className = 'btn btn-sm btn-outline';
    button.style.marginBottom = '10px';
    return button;
  });

  const sortedButtons = buttons.sort((a, b) => {
    return a.innerHTML.localeCompare(b.innerHTML);
  });

  const reversedButtons = sortedButtons.reverse();

  const discussionBucket = document.getElementById('discussion_bucket');
  if (discussionBucket) {
    const existingButtons = discussionBucket.querySelectorAll('.unsolved-button');
    existingButtons.forEach(button => {
      button.remove();
    });
    reversedButtons.forEach(button => {
      discussionBucket.insertBefore(button, discussionBucket.firstChild);
    });
  }
}

function onPullRequestConversation() {
  const pathnameParts = window.location.pathname.split('/');
  const onPR = pathnameParts[3] === 'pull';
  const selectedTab = document.querySelector('a.tabnav-tab.selected');
  const onConvTab = selectedTab && selectedTab.text.includes('Conversation');
  return onPR && onConvTab;
}

if (onPullRequestConversation()) {
  const discussionBucket = document.getElementById('discussion_bucket');
  if (discussionBucket) {
    const unsolvedButton = document.createElement('button');
    unsolvedButton.innerHTML = 'Unresolved Conversations';
    unsolvedButton.id = 'no-unresolved-button';
    unsolvedButton.onclick = () => {
      generateConversationButtons();
      unsolvedButton.disabled = true;
      unsolvedButton.innerHTML = 'No unresolved conversation exists';
    };
    unsolvedButton.className = 'btn btn-sm btn-outline unsolved-button';
    unsolvedButton.style.marginBottom = '10px';
    discussionBucket.insertBefore(unsolvedButton, discussionBucket.firstChild);
  }
}
