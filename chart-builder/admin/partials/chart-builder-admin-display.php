<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://ays-pro.com/
 * @since      1.0.0
 *
 * @package    Chart_Builder
 * @subpackage Chart_Builder/admin/partials
 */

$chart_page_url = sprintf('?page=%s', 'chart-builder');
$add_new_url = sprintf('?page=%s&action=%s', 'chart-builder', 'add');

?>
<div class="wrap">
    <!-- <div class="ays-chart-builder-wrapper" style="position:relative;">
        <h1 class="ays_heart_beat"><?php // echo __(esc_html(get_admin_page_title()),$this->plugin_name); ?> <i class="ays_fa ays_fa_heart_o animated"></i></h1>
    </div> -->
    <div class="ays-chart-heading-box">
        <div class="ays-chart-wordpress-user-manual-box">
            <a href="https://ays-pro.com/wordpress-chart-builder-plugin-user-manual" target="_blank" style="text-decoration: none;font-size: 13px;">
                <i class="ays_fa ays_fa_file_text" ></i> 
                <span style="margin-left: 3px;text-decoration: underline;">View Documentation</span>
            </a>
        </div>
    </div>
    <div class="ays-chart-heart-beat-main-heading ays-chart-heart-beat-main-heading-container">
        <h1 class="ays-chart-builder-wrapper ays_heart_beat">
            <?php echo esc_html( get_admin_page_title() ); ?> <i class="ays_fa ays_fa_heart_o animated"></i>
        </h1>
    </div>
    <div class="ays-chart-faq-main">
        <h2>
            <?php echo __("How to create a chart in 4 steps with the help of the", 'chart-builder' ) .
            ' <strong>'. __("Chartify", 'chart-builder' ) .'</strong> '.
            __("plugin.", 'chart-builder' ); ?>
            
        </h2>
        <fieldset>
            <div class="ays-chart-ol-container">
                <ol>
                    <li>
                        <?php echo __( "Go to the", 'chart-builder' ) . ' <a href="'. $chart_page_url .'" target="_blank">'. __( "Chartify" , 'chart-builder' ) .'</a> ' .  __( "page and click on the", 'chart-builder' ) . ' <a href="'. $add_new_url .'" target="_blank">'. __( "Add New" , 'chart-builder' ) .'</a> ' .  __( "button for creating your first chart.", 'chart-builder' ); ?>,
                    </li>
                    <li>
                        <?php echo __( "Choose your preferred chart type and click on the Next button.",'chart-builder' ); ?>
                    </li>
                    <li>
                        <?php echo __( "Add the needed data for your chart (manually, from Google Sheets and from Database)", 'chart-builder' ); ?>
                    </li>
                    <li>
                        <?php echo __( "Copy the", 'chart-builder' ) . ' <strong>'. __( "shortcode" , 'chart-builder' ) .'</strong> ' .  __( "of the chart and paste it into any post․", 'chart-builder' ); ?> 
                    </li>
                </ol>
            </div>
            <div class="ays-chart-p-container">
                <p><?php echo __("Congrats! You have already created your first chart." , 'chart-builder'); ?></p>
            </div>
        </fieldset>
    </div>
    <br>

    <div class="ays-chart-community-wrap">
        <div class="ays-chart-community-title">
            <h4><?php echo __( "Community", 'chart-builder' ); ?></h4>
        </div>
        <div class="ays-chart-community-youtube-video">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/xP1M_j1haUg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowfullscreen></iframe>
        </div>
        <div class="ays-chart-community-container">
            <div class="ays-chart-community-item">
                <a href="https://www.youtube.com/channel/UC-1vioc90xaKjE7stq30wmA" target="_blank" class="ays-chart-community-item-cover" >
                    <i class="ays-chart-community-item-img ays_fa ays_fa_youtube_play"></i>
                </a>
                <h3 class="ays-chart-community-item-title"><?php echo __( "YouTube community", 'chart-builder' ); ?></h3>
                <p class="ays-chart-community-item-desc"><?php echo __("Our YouTube community  guides you to step by step tutorials about our products and not only...", 'chart-builder'); ?></p>
                <p class="ays-chart-community-item-desc"></p>
                <div class="ays-chart-community-item-footer">
                    <a href="https://www.youtube.com/channel/UC-1vioc90xaKjE7stq30wmA" target="_blank" class="button"><?php echo __( "Subscribe", 'chart-builder' ); ?></a>
                </div>
            </div>
            <div class="ays-chart-community-item">
                <a href="https://wordpress.org/support/plugin/chart-builder/" target="_blank" class="ays-chart-community-item-cover" >
                    <i class="ays-chart-community-item-img ays_fa ays_fa_wordpress"></i>
                </a>
                <h3 class="ays-chart-community-item-title"><?php echo __( "Best Free support", 'chart-builder' ); ?></h3>
                <p class="ays-chart-community-item-desc"><?php echo __( "With the Free version, you get a lifetime usage for the plugin, however, you will get new updates and support for only 1 month.", 'chart-builder' ); ?></p>
                <p class="ays-chart-community-item-desc"></p>
                <div class="ays-chart-community-item-footer">
                    <a href="https://wordpress.org/support/plugin/chart-builder/" target="_blank" class="button"><?php echo __( "Join", 'chart-builder' ); ?></a>
                </div>
            </div>
            <div class="ays-chart-community-item">
                <a href="https://ays-pro.com/contact" target="_blank" class="ays-chart-community-item-cover" >
                    <i class="ays-chart-community-item-img ays_fa ays_fa_users" aria-hidden="true"></i>
                </a>
                <h3 class="ays-chart-community-item-title"><?php echo __( "Premium support", 'chart-builder' ); ?></h3>
                <p class="ays-chart-community-item-desc"><?php echo __( "Get 12 months updates and support for the Business package and lifetime updates and support for the Developer package.", 'chart-builder' ); ?></p>
                <p class="ays-chart-community-item-desc"></p>
                <div class="ays-chart-community-item-footer">
                    <a href="https://ays-pro.com/contact" target="_blank" class="button"><?php echo __( "Contact", 'chart-builder' ); ?></a>
                </div>
            </div>
        </div>
    </div>
</div>