import { createRoot } from 'react-dom/client';

import '@/entrypoints/public-path';

import { start } from 'flavours/polyam/common';
import { Status } from 'flavours/polyam/features/standalone/status';
import { afterInitialRender } from 'flavours/polyam/hooks/useRenderSignal';
import { loadPolyfills } from 'flavours/polyam/polyfills';
import ready from 'flavours/polyam/ready';

start();

function loaded() {
  const mountNode = document.getElementById('mastodon-status');

  if (mountNode) {
    const attr = mountNode.getAttribute('data-props');

    if (!attr) return;

    const props = JSON.parse(attr) as { id: string; locale: string };
    const root = createRoot(mountNode);

    root.render(<Status {...props} />);
  }
}

function main() {
  ready(loaded).catch((error: unknown) => {
    console.error(error);
  });
}

loadPolyfills()
  .then(main)
  .catch((error: unknown) => {
    console.error(error);
  });

interface SetHeightMessage {
  type: 'setHeight';
  id: string;
  height: number;
}

function isSetHeightMessage(data: unknown): data is SetHeightMessage {
  if (
    data &&
    typeof data === 'object' &&
    'type' in data &&
    data.type === 'setHeight'
  )
    return true;
  else return false;
}

window.addEventListener('message', (e) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- typings are not correct, it can be null in very rare cases
  if (!e.data || !isSetHeightMessage(e.data) || !window.parent) return;

  const data = e.data;

  // We use a timeout to allow for the React page to render before calculating the height
  afterInitialRender(() => {
    window.parent.postMessage(
      {
        type: 'setHeight',
        id: data.id,
        height: document.getElementsByTagName('html')[0]?.scrollHeight,
      },
      '*',
    );
  });
});
