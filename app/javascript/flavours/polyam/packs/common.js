import 'packs/public-path';
import Rails from '@rails/ujs';
import 'flavours/polyam/styles/index.scss';

Rails.start();

//  This ensures that webpack compiles our images.
require.context('../images', true, /\.(jpg|png|svg)$/);
