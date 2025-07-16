<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://ays-pro.com/
 * @since      1.0.0
 *
 * @package    Chart_Builder
 * @subpackage Chart_Builder/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Chart_Builder
 * @subpackage Chart_Builder/includes
 * @author     Chart Builder Team <info@ays-pro.com>
 */
class Chart_Builder_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		if ( version_compare( get_bloginfo( 'version' ), '6.7', '>=' ) ) {
            $plugin = 'chart-builder';
            if( is_admin() ){
                $locale = get_user_locale();
            } else {
                $locale = get_locale();
            }


            if ( is_textdomain_loaded( $plugin ) ) {
                unload_textdomain( $plugin );
            }
            $mofile = sprintf( '%s-%s.mo', $plugin, $locale );
            //check the installation language path first.
            $domain_path = path_join( WP_LANG_DIR, 'plugins' );
            $loaded = load_textdomain( $plugin, path_join( $domain_path, $mofile ) );

            if ( ! $loaded ) { //else, check the plugin language folder.
                $domain_path = path_join( WP_PLUGIN_DIR, "{$plugin}/languages" );
                load_textdomain( $plugin, path_join( $domain_path, $mofile ) );
            }
        } else {
            load_plugin_textdomain(
				'chart-builder',
				false,
				dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
			);
        }

	}



}
