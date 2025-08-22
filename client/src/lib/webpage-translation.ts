// Webpage-level translation using Google Translate widget
export function initializeWebpageTranslation() {
  // Check if already initialized
  if ((window as any).google?.translate) {
    return;
  }

  // Add Google Translate script
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);

  // Initialize Google Translate
  (window as any).googleTranslateElementInit = function() {
    // Ensure container exists
    let container = document.getElementById('google_translate_element');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,zh-CN',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
      },
      'google_translate_element'
    );
  };
}

export function translatePage(targetLanguage: string) {
  const normalized = targetLanguage === 'zh' ? 'zh-CN' : targetLanguage;

  // Try using the dropdown select directly
  const trySelectChange = (): boolean => {
    const combo = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      if (combo.value !== normalized) {
        combo.value = normalized;
        combo.dispatchEvent(new Event('change'));
      } else {
        // Force change event to re-apply
        combo.dispatchEvent(new Event('change'));
      }
      return true;
    }
    return false;
  };

  if (trySelectChange()) return;

  // Retry a few times as the widget loads asynchronously
  let attempts = 0;
  const maxAttempts = 20; // ~2s at 100ms
  const interval = setInterval(() => {
    attempts += 1;
    if (trySelectChange() || attempts >= maxAttempts) {
      clearInterval(interval);
      if (attempts >= maxAttempts) {
        // Fallback: click inside menu iframe if present
        const translateFrame = document.querySelector('iframe.goog-te-menu-frame') as HTMLIFrameElement | null;
        const frameDoc = translateFrame?.contentDocument || translateFrame?.contentWindow?.document;
        const languageLink = frameDoc?.querySelector(`a[data-value="${normalized}"]`) as HTMLElement | null;
        languageLink?.click();
      }
    }
  }, 100);
}

// Alternative: Use a simpler API-based approach
export async function translatePageContent(targetLanguage: string) {
  // English resets to original by refreshing if selecting English
  if (targetLanguage === 'en') {
    window.location.reload();
    return;
  }

  const { localTranslate } = await import('./local-translations');

  // Translate visible text nodes
  const textNodes = getAllTextNodes(document.body);
  for (const node of textNodes) {
    const src = node.textContent || '';
    if (!src.trim()) continue;
    node.textContent = localTranslate(src, 'fr');
  }

  // Translate common attributes like placeholders
  const withPlaceholder = Array.from(document.querySelectorAll<HTMLElement>('[placeholder]'));
  for (const el of withPlaceholder) {
    const placeholder = el.getAttribute('placeholder');
    if (placeholder && placeholder.trim()) {
      el.setAttribute('placeholder', localTranslate(placeholder, 'fr'));
    }
  }
}

function getAllTextNodes(element: Element): Text[] {
  const textNodes: Text[] = [];
  
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      if (textNode.textContent?.trim()) {
        textNodes.push(textNode);
      }
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        walk(node.childNodes[i]);
      }
    }
  }
  
  walk(element);
  return textNodes;
}