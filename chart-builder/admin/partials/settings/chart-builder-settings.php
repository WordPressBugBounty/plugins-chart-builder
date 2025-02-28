<?php

    $loader_iamge = "<span class='display_none ays_chart_loader_box'><img src=". CHART_BUILDER_ADMIN_URL ."/images/loaders/loading.gif></span>";

    if( isset( $_REQUEST['ays_submit'] ) ){
	    $this->settings_obj->store_data();
    }
    
    $ays_tab = isset($_GET['ays_tab']) && esc_attr(stripslashes(sanitize_text_field($_GET['ays_tab']))) !== ''
                ? esc_attr(stripslashes(sanitize_text_field($_GET['ays_tab'])))
                : 'tab1';

    if ($ays_tab !== 'tab1' && $ays_tab !== 'tab2') {
        $url = remove_query_arg( array('ays_tab') );
        wp_redirect( $url );
    }

    $db_data = $this->settings_obj->get_all_data();
    $options = ($this->settings_obj->get_setting('options') === false) ? array() : json_decode($this->settings_obj->get_setting('options'), true);

    global $wp_roles;
    $ays_users_roles = $wp_roles->role_names;
    $user_roles = $this->settings_obj->get_setting('user_roles');
    if( $user_roles === null || $user_roles === false ){
        $user_roles = array();
    }else{
        $user_roles = json_decode( $user_roles );
    }

    // User roles to change plugin
    $user_roles_to_change_plugin = (isset($options['user_roles_to_change']) && !empty( $options['user_roles_to_change'] ) ) ? $options['user_roles_to_change'] : array('administrator');

    $chart_title_length = (isset($options['title_length']) && $options['title_length'] != '') ? intval($options['title_length']) : 5;
?>
<div class="wrap" style="position:relative;">
    <div class="container-fluid">
        <div class="ays-chart-heading-box">
            <div class="ays-chart-wordpress-user-manual-box">
                <a href="https://ays-pro.com/wordpress-chart-builder-plugin-user-manual" target="_blank" style="text-decoration: none;font-size: 13px;">
                    <i class="ays_fa ays_fa_file_text" ></i> 
                    <span style="margin-left: 3px;text-decoration: underline;">View Documentation</span>
                </a>
            </div>
        </div>
        <form method="post" id="ays-settings-form">
            <input type="hidden" name="ays_tab" value="<?php echo esc_attr($ays_tab); ?>">
            <h1 class="wp-heading-inline">
            <?php
                echo esc_html__('General Settings','chart-builder');
            ?>
            </h1>
            <hr />
            <div class="ays-settings-wrapper ays-chart-general-settings">
                <div>
                    <div class="nav-tab-wrapper" style="position:sticky; top:35px;">
                        <a href="#tab1" data-tab="tab1" class="nav-tab <?php echo ($ays_tab == 'tab1') ? 'nav-tab-active' : ''; ?>">
                            <?php echo esc_html__("General", 'chart-builder');?>
                        </a>
                        <a href="#tab2" data-tab="tab2" class="nav-tab <?php echo ($ays_tab == 'tab2') ? 'nav-tab-active' : ''; ?>">
                            <?php echo esc_html__("Integrations", 'chart-builder');?>
                        </a>
                    </div>
                </div>
                <div class="ays-chart-tabs-wrapper">
                    <div id="tab1" class="ays-chart-tab-content ays-tab-content <?php echo ($ays_tab == 'tab1') ? 'ays-tab-content-active' : ''; ?>">
                        <p class="ays-subtitle"><?php echo esc_html__('General Settings','chart-builder')?></p>
                        <hr />
                        <fieldset>
                            <legend>
                                <strong style="font-size:30px;"><i class="ays_fa ays_fa_globe"></i></strong>
                                <h5><?php echo esc_html__('Who will have permission to Chart Builder','chart-builder')?></h5>
                            </legend>
                            <div class="form-group row" style="margin:0px;">
                                <div class="ays-pro-features-v2-main-box">
                                    <div class="ays-pro-features-v2-small-buttons-box">
                                        <div class="ays-pro-features-v2-video-button"></div>
                                        <a href="https://ays-pro.com/wordpress/chart-builder" target="_blank" class="ays-pro-features-v2-upgrade-button">
                                            <div class="ays-pro-features-v2-upgrade-icon" style="background-image: url('<?php echo esc_attr(CHART_BUILDER_ADMIN_URL); ?>/images/icons/pro-features-icons/Locked_24x24.svg');" data-img-src="<?php echo esc_attr(CHART_BUILDER_ADMIN_URL); ?>/images/icons/pro-features-icons/Locked_24x24.svg"></div>
                                            <div class="ays-pro-features-v2-upgrade-text">
                                                <?php echo esc_html__("Upgrade" , "chart-builder"); ?>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="form-group row">
                                        <div class="form-group row">
                                            <div class="col-sm-4">
                                                <label for="ays_user_roles">
                                                    <?php echo esc_html__( "Select user role for giving access to Chart Builder menu", 'chart-builder' ); ?>
                                                    <a class="ays_help" data-bs-toggle="tooltip" title="<?php echo esc_attr(__("Give access to the Chart Builder plugin to only the selected user role(s) on your WP dashboard. Each selected user will see only his/her created charts.",'chart-builder'))?>">
                                                        <i class="ays_fa ays_fa_info_circle"></i>
                                                    </a>
                                                </label>
                                            </div>
                                            <div class="col-sm-8">
                                                <select name="ays_user_roles[]" id="ays_user_roles" multiple>
                                                    <?php
                                                        foreach($ays_users_roles as $role => $role_name){
                                                            $selected = in_array($role, $user_roles) ? 'selected' : '';
                                                            echo "<option ". esc_html($selected) ." value='".esc_attr($role)."'>".esc_attr($role_name)."</option>";
                                                        }
                                                    ?>
                                                </select>
                                            </div>
                                        </div>
                                        <hr style="opacity:.25;margin:1rem 0;">
                                        <div class="form-group row">
                                            <div class="col-sm-4">
                                                <label for="ays_user_roles_to_change_plugin">
                                                    <?php echo esc_html__( "Select user role for giving access to change all chart data", 'chart-builder' ); ?>
                                                    <a class="ays_help" data-bs-toggle="tooltip" title="<?php echo esc_attr(__('Give permissions to manage all charts and submissions to these user roles. Please add the given user roles to the above field as well.','chart-builder'))?>">
                                                        <i class="ays_fa ays_fa_info_circle"></i>
                                                    </a>
                                                </label>
                                            </div>
                                            <div class="col-sm-8 ays-chart-user-roles">
                                                <select name="ays_user_roles_to_change_plugin[]" id="ays_user_roles_to_change_plugin" multiple>
                                                    <?php
                                                        foreach($ays_users_roles as $role => $role_name){
                                                            $selected = in_array($role, $user_roles_to_change_plugin) ? 'selected' : '';
                                                            echo "<option ". esc_html($selected) ." value='".esc_attr($role)."'>".esc_attr($role_name)."</option>";                                                      
                                                        }
                                                    ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                    <blockquote>
                                        <?php echo esc_html__( "Control the access of the plugin from the dashboard and manage the capabilities of those user roles.", 'chart-builder' ); ?>
                                        <br>
                                        <?php echo esc_html__( "If you want to give a full control to the given user role, please add the role in both fields.", 'chart-builder'); ?>
                                    </blockquote>
                                </div>
                            </div>
                        </fieldset>
                        <hr>
                        <fieldset>
                            <legend>
                                <strong style="font-size:30px;"><i class="ays_fa ays_fa_text"></i></strong>
                                <h5><?php echo esc_html__('Except words count in list table','chart-builder')?></h5>
                            </legend>
                            <div class="form-group row">
                                <div class="col-sm-4">
                                    <label for="ays_chart_title_length">
                                        <?php echo esc_html__( "Charts list table", 'chart-builder' ); ?>
                                        <a class="ays_help" data-bs-toggle="tooltip" title="<?php echo esc_attr(__('Determine the length of the questions to be shown in the Charts List Table by putting your preferred count of words in the following field. (For example: if you put 10,  you will see the first 10 words of each question in the Charts page of your dashboard.', 'chart-builder')); ?>">
                                            <i class="ays_fa ays_fa_info_circle"></i>
                                        </a>
                                    </label>
                                </div>
                                <div class="col-sm-8">
                                    <input type="number" name="ays_chart_title_length" id="ays_chart_title_length" class="ays-text-input" value="<?php echo esc_attr($chart_title_length); ?>">
                                </div>
                            </div>
                        </fieldset> <!-- Excerpt words count in list table -->
                    </div>
                    <div id="tab2" class="ays-chart-tab-content ays-tab-content <?php echo ($ays_tab == 'tab2') ? 'ays-tab-content-active' : ''; ?>">
                        <p class="ays-subtitle"><?php echo esc_html__('Integrations','chart-builder')?></p>
                        <hr />
                        <?php
                            do_action( 'ays_cb_settings_page_integrations' );
                        ?>
                    </div>
                </div>
            </div>
            <hr />
            <div style="position:sticky;padding:15px 0px;bottom:0;">
            <?php
                wp_nonce_field('settings_action', 'settings_action');
                $other_attributes = array();
                submit_button(esc_html__('Save changes', 'chart-builder'), 'primary ays-chart-loader-banner ays-chart-gen-settings-save', 'ays_submit', true, $other_attributes);
                echo $loader_iamge;
            ?>
            </div>
        </form>
    </div>
</div>
