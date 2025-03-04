<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://ays-pro.com/
 * @since      1.0.0
 *
 * @package    Chart_Builder
 * @subpackage Chart_Builder/includes
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Chart_Builder
 * @subpackage Chart_Builder/includes
 * @author     AYS Pro LLC <info@ays-pro.com>
 */
class Chart_Builder_Integrations
{

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $plugin_name The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $version The current version of this plugin.
     */
    private $version;

    private $settings_obj;

    private $capability;

    private $blockquote_content;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string $plugin_name The name of this plugin.
     * @param      string $version The version of this plugin.
     */
    public function __construct($plugin_name, $version){

        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->settings_obj = new Chart_Builder_Settings_DB_Actions($this->plugin_name);

        // Add an action to load translations properly
        add_action('wp_loaded', array($this, 'ays_chart_load_translations'));
    }

    /**
     * Load plugin translations.
     */
    public function ays_chart_load_translations() {
        
        $settings_url = sprintf(
            // Translators: %s will be replaced with a link to the settings page.
            __( "For enabling this option, please go to %s page and fill all options.", 'chart-builder' ),
            "<a style='color:blue;text-decoration:underline;font-size:20px;' href='?page=".'chart-builder'."-settings&ays_tab=tab2' target='_blank'>". __( "this", 'chart-builder' ) ."</a>"
        );
        $blockquote_content = '<blockquote class="error_message">'. $settings_url .'</blockquote>';
        $this->blockquote_content = $blockquote_content;
    }

    // ===== INTEGRATIONS HOOKS =====

    public function ays_chart_page_integrations_content( $args ){

        if( ! $this->settings_obj->get_permission_for_editing_plugin() ){
            $settings_url = esc_html__( "This functionality is disabled.", 'chart-builder' );
            $blockquote_content = '<blockquote class="error_message">'. esc_html( $settings_url ) .'</blockquote>';
            $this->blockquote_content = $blockquote_content;
        }

        $integrations_contents = apply_filters( 'ays_cb_chart_page_integrations_contents', array(), $args );
        
        $integrations = array();

        foreach ($integrations_contents as $key => $integrations_content) {
            $content = '<fieldset>';
            if(isset($integrations_content['title'])){
                $content .= '<legend>';
                if(isset($integrations_content['icon'])){
                    $content .= '<img class="ays_integration_logo" src="' . esc_url( $integrations_content['icon'] ) . '" alt="">';
                }
                $content .= '<h5>' . esc_html( $integrations_content['title'] ) . '</h5></legend>';
            }
            $content .= $integrations_content['content'];

            $content .= '</fieldset>';

            $integrations[] = $content;
        }
        echo  implode('<hr />', $integrations) ; 

    }

    // Integrations settings page action hook
    public function ays_settings_page_integrations_content( $args ){

        $integrations_contents = apply_filters( 'ays_cb_settings_page_integrations_contents', array(), $args );
        
        $integrations = array();

        foreach ($integrations_contents as $key => $integrations_content) {
            $content = '<fieldset>';
            if(isset($integrations_content['title'])){
                $content .= '<legend>';
                if(isset($integrations_content['icon'])){
                    $content .= '<img class="ays_integration_logo" src="'. $integrations_content['icon'] .'" alt="">';
                }
                $content .= '<h5>'. $integrations_content['title'] .'</h5></legend>';
            }
            if(isset($integrations_content['content'])){
                $content .= $integrations_content['content'];
            }

            $content .= '</fieldset>';

            $integrations[] = $content;
        }

        echo  implode('<hr />', $integrations) ; 
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    //====================================================================================//
    ////////////////////////////////////////////////////////////////////////////////////////

    // ===== Google sheet starts =====

        public function source_contents_import_from_google_sheet_settings( $sources, $args ){

            $html_class_prefix = $args['html_class_prefix'];
			$html_name_prefix = $args['html_name_prefix'];

            ob_start();
            ?>
            <div class="ays-accordion-data-main-wrap ays-pro-features-v2-main-box">
                <div class="ays-pro-features-v2-big-buttons-box">
                    <a href="https://www.youtube.com/watch?v=Qox2ev6OgUM" target="_blank" class="ays-pro-features-v2-video-button">
                        <div class="ays-pro-features-v2-video-icon" style="background-image: url('<?php echo esc_attr(CHART_BUILDER_ADMIN_URL); ?>/images/icons/pro-features-icons/Video_24x24.svg');" data-img-src="<?php echo esc_attr(CHART_BUILDER_ADMIN_URL); ?>/images/icons/pro-features-icons/Video_24x24_Hover.svg"></div>
                        <div class="ays-pro-features-v2-video-text">
                            <?php echo esc_html__("Watch Video" , "chart-builder"); ?>
                        </div>
                    </a>
                    <a href="https://ays-pro.com/wordpress/chart-builder" target="_blank" class="ays-pro-features-v2-upgrade-button">
                        <div class="ays-pro-features-v2-upgrade-icon" style="background-image: url('<?php echo esc_attr(CHART_BUILDER_ADMIN_URL); ?>/images/icons/pro-features-icons/Locked_24x24.svg');" data-img-src="<?php echo esc_attr(CHART_BUILDER_ADMIN_URL); ?>/images/icons/pro-features-icons/Locked_24x24.svg"></div>
                        <div class="ays-pro-features-v2-upgrade-text">
                            <?php echo esc_html__("Upgrade" , "chart-builder"); ?>
                        </div>
                    </a>
                </div>
                <div class="<?php echo esc_attr($html_class_prefix) ?>source-data-main-wrap">
                    <div class="<?php echo esc_attr($html_class_prefix)  ?>chart-source-data-main">
                        <div id="ays-chart-google-sheet-form">
                            <div class="<?php echo esc_attr($html_class_prefix)?>google-sheet-select-wrap">
                                <select name="<?php echo esc_attr($html_class_prefix) ?>google_sheet_id" id="" class="<?php echo esc_attr($html_class_prefix) ?>google-sheet-select" data-chart-id="1">
                                    <option value=""><?php echo esc_html__( 'Select spreadsheet', 'chart-builder' ) ?></option>
                                </select>
                            </div>
                            <div class="ays-chart-buttons-group">
                                <div class="ays-chart-buttons-group-main">
                                    <button class="<?php echo esc_attr($html_class_prefix) ?>show-on-chart-bttns" id="ays-chart-gsheet-fetch">
                                        <?php echo esc_html__( 'Show Results', "chart-builder" ); ?>
                                    </button>
                                    <button class="<?php echo esc_attr($html_class_prefix) ?>show-on-chart-bttns" id="ays-chart-gsheet-show-on-chart">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.722 6.59785C12.2407 3.47754 10.0017 1.90723 7.00009 1.90723C3.99697 1.90723 1.75947 3.47754 0.278215 6.59941C0.218802 6.72522 0.187988 6.86263 0.187988 7.00176C0.187988 7.14089 0.218802 7.27829 0.278215 7.4041C1.75947 10.5244 3.99853 12.0947 7.00009 12.0947C10.0032 12.0947 12.2407 10.5244 13.722 7.40254C13.8423 7.14941 13.8423 6.85566 13.722 6.59785ZM7.00009 10.9697C4.47978 10.9697 2.63447 9.6916 1.3329 7.00098C2.63447 4.31035 4.47978 3.03223 7.00009 3.03223C9.5204 3.03223 11.3657 4.31035 12.6673 7.00098C11.3673 9.6916 9.52197 10.9697 7.00009 10.9697ZM6.93759 4.25098C5.41884 4.25098 4.18759 5.48223 4.18759 7.00098C4.18759 8.51973 5.41884 9.75098 6.93759 9.75098C8.45634 9.75098 9.68759 8.51973 9.68759 7.00098C9.68759 5.48223 8.45634 4.25098 6.93759 4.25098ZM6.93759 8.75098C5.9704 8.75098 5.18759 7.96816 5.18759 7.00098C5.18759 6.03379 5.9704 5.25098 6.93759 5.25098C7.90478 5.25098 8.68759 6.03379 8.68759 7.00098C8.68759 7.96816 7.90478 8.75098 6.93759 8.75098Z" fill="#14524A" /></svg>
                                        <?php echo esc_html__( 'Preview', "chart-builder" ); ?>
                                    </button>
                                    <button class="<?php echo esc_attr($html_class_prefix) ?>show-on-chart-bttns" id="ays-chart-gsheet-save">
                                        <?php echo esc_html__( 'Save data', "chart-builder" ); ?>
                                    </button>
                                </div>
                                <div class="ays-chart-buttons-group-columns">
                                    <button class="<?php echo esc_attr($html_class_prefix) ?>show-on-chart-bttns" id="ays-chart-gsheet-columns">
                                        <?php echo esc_html__( 'Columns', "chart-builder" ); ?>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php
            $content = ob_get_clean();

            $title = __( 'Connect to Google Sheets', 'chart-builder') . ' <a class="ays_help" data-bs-toggle="tooltip" title="' . __("Activate Google Integration to import the information from the Google Sheets.",'chart-builder') . '">
                            <i class="ays_fa ays_fa_info_circle"></i>
                        </a>';

            $sources['google_sheet'] = array(
                'content' => $content,
                'title' => $title
            );

            return $sources;
        }

        // Google sheet integration / settings page
        // Google sheet integration / settings page content    
        public function ays_settings_page_google_sheet_content($integrations, $args){
            $icon  = CHART_BUILDER_ADMIN_URL . '/images/integrations/google_logo.png';
            $title = __( 'Google', 'chart-builder' );

            $content = '<div class="form-group row ays-pro-features-v2-main-box">
                            <div class="ays-pro-features-v2-small-buttons-box" style="width:fit-content;">
                                <a href="https://www.youtube.com/watch?v=Qox2ev6OgUM" target="_blank" class="ays-pro-features-v2-video-button">
                                    <div class="ays-pro-features-v2-video-icon" style="background-image: url(&quot;' . esc_attr(CHART_BUILDER_ADMIN_URL) . '/images/icons/pro-features-icons/Video_24x24.svg&quot;);" data-img-src="' . esc_attr(CHART_BUILDER_ADMIN_URL) . '/images/icons/pro-features-icons/Video_24x24_Hover.svg"></div>
                                    <div class="ays-pro-features-v2-video-text">
                                        '. __("Watch Video" , "chart-builder") .'
                                    </div>
                                </a>
                                <a href="https://ays-pro.com/wordpress/chart-builder" target="_blank" class="ays-pro-features-v2-upgrade-button">
                                    <div class="ays-pro-features-v2-upgrade-icon" style="background-image: url(&quot;' . esc_attr(CHART_BUILDER_ADMIN_URL) . '/images/icons/pro-features-icons/Locked_24x24.svg&quot;)" data-img-src="' . esc_attr(CHART_BUILDER_ADMIN_URL) . '/images/icons/pro-features-icons/Locked_24x24.svg"></div>
                                    <div class="ays-pro-features-v2-upgrade-text">
                                        '. __("Upgrade", 'chart-builder') .'
                                    </div>
                                </a>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group row" aria-describedby="aaa">
                                    <div class="col-sm-3">
                                        <button id="googleInstructionsPopOver" type="button" class="btn btn-info" data-original-title="Google Integration Setup Instructions" >'. __("Instructions", 'chart-builder'). '</button>
                                        <div class="d-none" id="googleInstructions">
                                            <p>1. '. __("Turn on Your Google Sheet API", 'chart-builder') .'
                                                <a href="https://console.developers.google.com" target="_blank">https://console.developers.google.com</a>
                                            </p>
                                            <p>2. <a href="https://console.developers.google.com/apis/credentials" target="_blank">'. __("Create ", 'chart-builder') .'</a>'. __("new Google Oauth client ID credentials (if you do not still have)", 'chart-builder').'</p>
                                            <p>3. '. __("Choose the application type as <b>Web application</b>", 'chart-builder') .'</p>
                                            <p>4. '. __("Add the following link in the <b>Authorized redirect URIs</b> field", 'chart-builder') .'</p>
                                            <p>
                                                <code>Redirect url</code>
                                            </p>
                                            <p>5. '. __("Click on the <b>Create</b> button", 'chart-builder') .'</p>
                                            <p>6. '. __("Copy the <b>Your Client ID</b> and <b>Your Client Secret</b> from the opened popup and paste them in the corresponding fields.", 'chart-builder') .'</p>
                                            <p>7. '. __("Click on the <b>Connect</b> button to complete authorization", 'chart-builder') .'</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-sm-3">
                                        <label for="ays_google_client">
                                            '. __("Google Client ID", 'chart-builder') .'
                                        </label>
                                    </div>
                                    <div class="col-sm-9">
                                        <input type="text" class="ays-text-input" id="ays_google_client" name="ays_google_client" value="">
                                    </div>
                                </div>
                                <br>
                                <div class="form-group row">
                                    <div class="col-sm-3">
                                        <label for="ays_google_secret">
                                            '. __("Google Client Secret", 'chart-builder') .'
                                        </label>
                                    </div>
                                    <div class="col-sm-9">
                                        <input type="text" class="ays-text-input" id="ays_google_secret" name="ays_google_secret" value="">
                                        <input type="hidden" id="ays_google_redirect" name="ays_google_redirect" value="">
                                    </div>
                                </div>
                                <br>
                                <div class="form-group row">
                                    <div class="col-sm-3"></div>
                                    <div class="col-sm-9">
                                        <button type="submit" name="ays_googleOAuth2" id="ays_googleOAuth2" class="btn btn-outline-info">
                                            '. __("Connect",'chart-builder') .'
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>';
                        
            $integrations['google'] = array(
                'content' => $content,
                'icon' => $icon,
                'title' => $title
            );
            return $integrations;        
        }
        
    // =====  Google sheet end   =====

    // ===== Database starts =====

        // Database integration / settings page
        public function ays_settings_page_database_content($integrations, $args) {
            $actions = $this->settings_obj;

            // Database settings
            $databaseb_res = ($actions->get_setting('database') === false) ? json_encode(array()) : $actions->get_setting('database');
            $db_settings = json_decode($databaseb_res, true);
            $db_host = isset($db_settings['host']) ? $db_settings['host'] : '';
            $db_name = isset($db_settings['db_name']) ? $db_settings['db_name'] : '';
            $db_user = isset($db_settings['user']) ? $db_settings['user'] : '';
            $db_password = isset($db_settings['password']) ? openssl_decrypt(base64_decode($db_settings['password']), 'aes-256-cbc', SECURE_AUTH_KEY, 0, substr(md5(SECURE_AUTH_KEY), 0, 16)) : '';
            $db_port = isset($db_settings['port']) ? $db_settings['port'] : '3306';

            $nonce = wp_create_nonce('ays_test_database_nonce');

            // Create the form content for database settings
            $content = '
                        <div class="form-group row ays-pro-features-v2-main-box">
                            <div class="ays-pro-features-v2-small-buttons-box" style="width:fit-content;">
                                <a href="https://ays-pro.com/wordpress/chart-builder" target="_blank" class="ays-pro-features-v2-upgrade-button">
                                    <div class="ays-pro-features-v2-upgrade-icon" style="background-image: url(&quot;' . esc_attr(CHART_BUILDER_ADMIN_URL) . '/images/icons/pro-features-icons/Locked_24x24.svg&quot;)" data-img-src="' . esc_attr(CHART_BUILDER_ADMIN_URL) . '/images/icons/pro-features-icons/Locked_24x24.svg"></div>
                                    <div class="ays-pro-features-v2-upgrade-text">
                                        '. __("Upgrade", 'chart-builder') .'
                                    </div>
                                </a>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group row" aria-describedby="aaa">
                                    <div class="col-sm-3">
                                        <button id="dbInstructionsPopOver" type="button" class="btn btn-info" data-original-title="Database Integration Setup Instructions" >' . __("Instructions", 'chart-builder') . '</button>
                                        <div class="d-none" id="dbInstructions">
                                            <p><strong>' . __("IP Access:", 'chart-builder') . '</strong></p>
                                            <p>'. __("In some cases, your database may block connections from unknown IP addresses. You might need to whitelist your IP in the database settings to allow access.", 'chart-builder') .'</p>
                                            <p><strong>' . __("Database Host:", 'chart-builder') . '</strong> ' . __("Enter the address of your database (e.g., 'localhost', or a host like 'db.example.com').", 'chart-builder') . '</p>
                                            <p><strong>' . __("Database Name:", 'chart-builder') . '</strong> ' . __("Enter the name of the database you want to connect to.", 'chart-builder') . '</p>
                                            <p><strong>' . __("Database User:", 'chart-builder') . '</strong> ' . __("Enter the username for accessing the database.", 'chart-builder') . '</p>
                                            <p><strong>' . __("Database Password:", 'chart-builder') . '</strong> ' . __("Enter the password for your database user. Make sure this is correct.", 'chart-builder') . '</p>
                                            <p><strong>' . __("Database Port (Optional):", 'chart-builder') . '</strong> ' . __("The default MySQL port is '3306'. You can leave this field empty. If your host doesn't specify a port, we'll use the default value.", 'chart-builder') . '</p>
                                            <p><strong>' . __("Test Connection:", 'chart-builder') . '</strong> ' . __("Click on the 'Test Connection' button to verify that the connection is successful.", 'chart-builder') . '</p>
                                            <p><strong>' . __("If the test fails:", 'chart-builder') . '</strong> ' . __("Please recheck your details or verify if your IP address is whitelisted.", 'chart-builder') . '</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-sm-3">
                                        <label for="ays_database_host">'. __("Database Host", 'chart-builder') .'</label>
                                    </div>
                                    <div class="col-sm-9">
                                        <input type="text" class="ays-text-input" id="ays_database_host" name="ays_database_host" value="'. esc_attr($db_host) .'">
                                    </div>
                                </div>
                                <br>
                                <div class="form-group row">
                                    <div class="col-sm-3">
                                        <label for="ays_database_name">'. __("Database Name", 'chart-builder') .'</label>
                                    </div>
                                    <div class="col-sm-9">
                                        <input type="text" class="ays-text-input" id="ays_database_name" name="ays_database_name" value="'. esc_attr($db_name) .'">
                                    </div>
                                </div>
                                <br>
                                <div class="form-group row">
                                    <div class="col-sm-3">
                                        <label for="ays_database_user">'. __("Database User", 'chart-builder') .'</label>
                                    </div>
                                    <div class="col-sm-9">
                                        <input type="text" class="ays-text-input" id="ays_database_user" name="ays_database_user" value="'. esc_attr($db_user) .'">
                                    </div>
                                </div>
                                <br>
                                <div class="form-group row">
                                    <div class="col-sm-3">
                                        <label for="ays_database_password">'. __("Database Password", 'chart-builder') .'</label>
                                    </div>
                                    <div class="col-sm-9">
                                        <input type="password" class="ays-text-input" id="ays_database_password" name="ays_database_password" value="'. esc_attr($db_password) .'">
                                    </div>
                                </div>
                                <br>
                                <div class="form-group row">
                                    <div class="col-sm-3">
                                        <label for="ays_database_port">'. __("Database Port (optional)", 'chart-builder') .'</label>
                                    </div>
                                    <div class="col-sm-9">
                                        <input type="text" class="ays-text-input" id="ays_database_port" name="ays_database_port" value="'. esc_attr($db_port) .'" placeholder="3306">
                                    </div>
                                </div>
                                <br>
                                <div class="form-group row">
                                    <div class="col-sm-3"></div>
                                    <div class="col-sm-9">
                                        <button id="ays_database_test_connection" class="btn btn-outline-info">
                                            '. __("Test Connection", 'chart-builder') .'
                                        </button>
                                        <span class="ays_cb_loader display_none_not_important"><img src=' . CHART_BUILDER_ADMIN_URL . '/images/loaders/loading.gif></span>
                                        <input type="hidden" id="ays_database_nonce" value="'. esc_attr($nonce) .'">
                                    </div>
                                </div>
                            </div>
                        </div>';

            $icon  = CHART_BUILDER_ADMIN_URL . '/images/integrations/database_logo.png';
            $title = __( 'Database', 'chart-builder' );
            $integrations['database'] = array(
                'content' => $content,
                'icon' => $icon,
                'title' => $title
            );

            return $integrations;
        }
    // ===== Database end =====
    
    ////////////////////////////////////////////////////////////////////////////////////////
    //====================================================================================//
    ////////////////////////////////////////////////////////////////////////////////////////
}
