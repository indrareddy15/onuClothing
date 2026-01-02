import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store'
import { Provider } from 'react-redux'
import { ToastProvider } from './Contaxt/ToastProvider';
import { SessionStorageProvider } from './Contaxt/SessionStorageContext';
import { LocationContextProvider } from './Contaxt/LocationContext';
import { SettingsProvider } from './Contaxt/SettingsContext';
import { LocalStorageContextProvider } from './Contaxt/LocalStorageContext';
import { EncryptionDecryptionProvider } from './Contaxt/EncryptionContext';
import { SeverWishListProvider } from './Contaxt/ServerWishListContext';
import { SeverBannersProvider } from './Contaxt/ServerBannerContext';
import { SeverAuthProvider } from './Contaxt/AuthContext';
import { Toaster } from 'react-hot-toast';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<Provider store={store}>
		<React.StrictMode >
			<SeverAuthProvider>
				<ToastProvider>
					<SessionStorageProvider>
						<LocalStorageContextProvider>
							<LocationContextProvider>
								<SettingsProvider>
									<EncryptionDecryptionProvider>
										<SeverBannersProvider>
											<SeverWishListProvider>
												<App />
												<Toaster
													position="top-center"
													reverseOrder={false}
												/>
											</SeverWishListProvider>
										</SeverBannersProvider>
									</EncryptionDecryptionProvider>
								</SettingsProvider>
							</LocationContextProvider>
						</LocalStorageContextProvider>
					</SessionStorageProvider>
				</ToastProvider>
			</SeverAuthProvider>
		</React.StrictMode>
	</Provider>
);
