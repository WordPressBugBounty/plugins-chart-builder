<div id="tab1" class="ays-chart-tab-content ays-chart-tab-content-active">
    <div class="form-group row">
        <div class="col-sm-2">
            <label for='ays-title'>
                <?php echo esc_html(__('Title', "chart-builder")); ?>
                <a class="ays_help" data-bs-toggle="tooltip" title="<?php echo esc_html(__('Set the chart title.',"chart-builder")); ?>">
                    <i class="ays_fa ays_fa_info_circle"></i>
                </a>
            </label>
        </div>
        <div class="col-sm-10">
            <input type="text" class="ays-text-input form-control" id='ays-title' name='<?php echo esc_attr($html_name_prefix); ?>title' value="<?php echo esc_attr($title); ?>" />
        </div>
    </div> <!-- Title -->
    <div class='<?php echo esc_attr($html_class_prefix); ?>type-info-box'>
        <span class='<?php echo esc_attr($html_class_prefix); ?>type-info-box-text'>
            <?php echo esc_html(__('Chart source type:' , "chart-builder")); ?> 
            <span class='<?php echo esc_attr($html_class_prefix); ?>type-info-box-text-changeable'>
                <?php echo esc_attr($chart_source_types[$chart_source_type]); ?>
            </span>
        </span>
        <br>
        <span class='<?php echo esc_attr($html_class_prefix); ?>type-info-box-text'>
            <?php echo esc_html(__('Chart type:' , "chart-builder")); ?> 
            <span class='<?php echo esc_attr($html_class_prefix); ?>type-info-box-text-changeable'>
                <?php echo esc_attr($chart_types[$source_chart_type]); ?>
            </span>
        </span>
        <input type="hidden" class="form-control" id="ays-chart-option-chart-type" name="<?php echo esc_attr($html_name_prefix); ?>source_chart_type" value="<?php echo esc_attr($source_chart_type) ?>">
        <input type="hidden" class="form-control" id="ays-chart-option-chart-source-type" name="<?php echo esc_attr($html_name_prefix); ?>type" value="chart-js">
    </div>
    <hr />
    <div class="row">
        <div class="col-sm-6" style="position:relative">
            
            <div class="<?php echo esc_attr($html_class_prefix) ?>container">
                <div class="<?php echo esc_attr($html_class_prefix) ?>header-container">
                    <?php if ($settings['show_title'] == 'checked') : ?>
                        <div class="<?php echo esc_attr($html_class_prefix) ?>charts-title">
                            <?php echo esc_attr($title); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($settings['show_description'] == 'checked') : ?>
                        <div class="<?php echo esc_attr($html_class_prefix) ?>charts-description">
                            <?php echo esc_attr($description); ?>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="<?php echo esc_attr($html_class_prefix) ?>charts-main-container" id="<?php echo esc_attr($html_class_prefix).esc_attr($source_chart_type) ?>">
                    <canvas id="<?php echo esc_attr($html_class_prefix).'-canvas' ?>" style="margin:auto;"></canvas>
                </div>
            </div>

            <style>
                <?php
                    echo "div." . esc_attr($html_class_prefix) . "container {
                            position: sticky;
                            top: 50px;
                            border: " . esc_attr($settings['border_width_with_title']) . "px " . esc_attr($settings['border_style_with_title']) . " " . esc_attr($settings['border_color_with_title']) . ";
                            border-radius: " . esc_attr($settings['border_radius_with_title']) . "px;
                            padding: " . esc_attr($settings['padding_outer']) . "px;
                        }
                            
                        div." . esc_attr($html_class_prefix) . "charts-main-container {
                            width: " . esc_attr($settings['width'] ?: '100') . esc_attr($settings['width_format'] ?: '%') . ";
                            height: " . esc_attr($settings['height']).esc_attr($settings['height_format']) . ";
                            border: " . esc_attr($settings['border_width']) . "px " . esc_attr( $settings['border_style']) . " " . esc_attr($settings['border_color']) . ";
                            " . ($settings['box_shadow'] === "checked" ? "box-shadow: 2px 2px 10px 2px" . esc_attr( $settings['box_shadow_color']) . ";" : "") . ";
                            border-radius: " . esc_attr($settings['border_radius']) . "px;
                            background-color: " . esc_attr($settings['background_color_chart']) . ";
                        }
                        div." . esc_attr($html_class_prefix) . "charts-main-container canvas{
                            width: 100% !important;
                            height: 100% !important;
                        }
                        div." . esc_attr($html_class_prefix) . "header-container {
                            margin-bottom: " . esc_attr($settings['title_gap']) . "px !important;
                        }

                        div." . esc_attr($html_class_prefix) . "header-container>." . esc_attr($html_class_prefix) . "charts-title {
                            color: " . esc_attr($settings['title_color']) . ";
                            font-size: " . esc_attr($settings['title_font_size']) . "px;
                            font-weight: " . (isset( $settings['title_bold'] ) && $settings['title_bold'] == 'checked' ? 'bold' : 'normal') . ";
                            text-shadow: " . ($settings['title_text_shadow'] === 'checked' ? '2px 2px 5px '. esc_attr($settings['title_shadow_color']) : '') . ";
                            font-style: " . (isset( $settings['title_italic'] ) && $settings['title_italic'] != 'checked'? 'normal' : 'italic') . ";
                            text-align: " . esc_attr($settings['title_position']) . ";
                            text-transform: " . esc_attr( $settings['title_text_transform']) . ";
                            text-decoration: " . esc_attr($settings['title_text_decoration']) . ";
                            letter-spacing: " . esc_attr($settings['title_letter_spacing'] ). "px;
                            margin-bottom: " . esc_attr( $settings['title_gap_description'] ). "px;
                        }

                        div." . esc_attr($html_class_prefix) . "header-container>." . esc_attr($html_class_prefix) . "charts-description {
                            color: " . esc_attr($settings['description_color']) . ";
                            font-size: " . esc_attr($settings['description_font_size']) . "px; 
                            font-weight: " . (isset( $settings['description_bold'] ) && $settings['description_bold'] == 'checked' ? 'bold' : 'normal') . ";
                            text-shadow: " . ($settings['description_text_shadow'] === 'checked' ? '2px 2px 5px '. esc_attr($settings['description_shadow_color']) : '') . ";
                            font-style: " . (isset( $settings['description_italic'] ) && $settings['description_italic'] != 'checked'? 'normal' : 'italic') . ";
                            text-align: " . esc_attr($settings['description_position']) . ";
                            text-transform: " . esc_attr($settings['description_text_transform']) . ";
                            text-decoration: " . esc_attr($settings['description_text_decoration']) . ";
                            letter-spacing: " . esc_attr($settings['description_letter_spacing']) . "px;
                        }"
                ?>
            </style>
        </div>
        <div class="col-sm-6">
            <div>
                <div class="nav-tab-wrapper <?php echo esc_attr($html_class_prefix) ?>nav-tab-wrapper-chart">
                    <a href="#tab1" data-tab="tab1" class="<?php echo esc_attr($html_class_prefix) ?>nav-tab-chart nav-tab <?php echo ($ays_chart_tab == 'tab1') ? 'nav-tab-active' : ''; ?>">
                        <?php echo esc_html(__("Source", "chart-builder")); ?>
                    </a>
                    <a href="#tab2" data-tab="tab2" class="<?php echo esc_attr($html_class_prefix) ?>nav-tab-chart nav-tab <?php echo ($ays_chart_tab == 'tab2') ? 'nav-tab-active' : ''; ?>">
                        <?php echo esc_html(__("Settings", "chart-builder")); ?>
                    </a>
                    <a href="#tab3" data-tab="tab3" class="<?php echo esc_attr($html_class_prefix) ?>nav-tab-chart nav-tab <?php echo ($ays_chart_tab == 'tab3') ? 'nav-tab-active' : ''; ?>">
                        <?php echo esc_html(__("Styles", "chart-builder")); ?>
                    </a>
                    <?php if ($source_chart_type === 'pie_chart') : ?>
                        <a href="#tab4" data-tab="tab4" class="<?php echo esc_attr($html_class_prefix) ?>nav-tab-chart nav-tab <?php echo ($ays_chart_tab == 'tab4') ? 'nav-tab-active' : ''; ?>">
                            <?php 
                                // Translators: %s will be replaced with the chart type name.
                                echo esc_html(sprintf(__("%s settings", "chart-builder"), $chart_types_names[$source_chart_type]));
                             ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <div class="ays-form-tabs-wrapper">
                <div id="tab1" class="ays-tab-content <?php echo ($ays_chart_tab == 'tab1') ? 'ays-tab-content-active' : ''; ?>">
                    <input type="hidden" name="<?php echo esc_attr($html_name_prefix); ?>source_type" value="<?php echo esc_attr($source_type) ?>">
                    <br>
                    <div class="ays-accordions-container">
                        <?php
                        do_action( 'ays_cb_chart_page_sources_contents', array(
                            'chart_source_type' => $chart_source_type,
                            'chart' => $chart,
                            'chart_id' => $id,
                            'html_class_prefix' => $html_class_prefix,
                            'html_name_prefix' => $html_name_prefix,
                            'source' => $source,
                            'source_chart_type' => $source_chart_type,
                            'source_type' => $source_type,
                            'quiz_queries' => $quiz_queries,
                            'quiz_query_tooltips' => $quiz_query_tooltips,
                            'quiz_query' => $quiz_query,
                            'quiz_id' => $quiz_id,
                            'settings' => $settings,
                        ) );
                        ?>
                    </div>
                </div>
                <div id="tab2" class="ays-tab-content <?php echo ($ays_chart_tab == 'tab2') ? 'ays-tab-content-active' : ''; ?>">
                    <br>
                    <div class="ays-accordions-container">
	                    <?php
	                    do_action( 'ays_cb_chart_page_settings_contents', array(
                            'chart_source_type' => $chart_source_type,
		                    'chart_id' => $id,
                            'chart_description' => $description,
                            'create_author_data' => $create_author_data,
		                    'html_class_prefix' => $html_class_prefix,
		                    'html_name_prefix' => $html_name_prefix,
		                    'source' => $source,
                            'source_chart_type' => $source_chart_type,
                            'source_type' => $source_type,
		                    'status' => $status,
		                    'settings' => $settings,
	                    ) );
	                    ?>
                    </div>
                </div>
                <div id="tab3" class="ays-tab-content <?php echo ($ays_chart_tab == 'tab3') ? 'ays-tab-content-active' : ''; ?>">
                    <br>
                    <div class="ays-accordions-container">
	                    <?php
	                    do_action( 'ays_cb_chart_page_styles_contents', array(
                            'chart_source_type' => $chart_source_type,
		                    'chart_id' => $id,
                            'chart_description' => $description,
                            'create_author_data' => $create_author_data,
		                    'html_class_prefix' => $html_class_prefix,
		                    'html_name_prefix' => $html_name_prefix,
		                    'source' => $source,
		                    'source_type' => $source_type,
		                    'status' => $status,
		                    'settings' => $settings,
	                    ) );
	                    ?>
                    </div>
                </div>
                <?php if ($source_chart_type === 'pie_chart') : ?>
                    <div id="tab4" class="ays-tab-content <?php echo ($ays_chart_tab == 'tab4') ? 'ays-tab-content-active' : ''; ?>">
                        <br>
                        <div class="ays-accordions-container ays-chart-advanced-settings">
                            <?php
                            do_action( 'ays_cb_chart_page_advanced_settings_contents', array(
                                'chart_source_type' => $chart_source_type,
                                'chart_id' => $id,
                                'chart_description' => $description,
                                'html_class_prefix' => $html_class_prefix,
                                'html_name_prefix' => $html_name_prefix,
                                'source' => $source,
                                'source_chart_type' => $source_chart_type,
                                'source_type' => $source_type,
                                'status' => $status,
                                'settings' => $settings,
                                'tab_name' => $chart_types_names[$source_chart_type]." settings"
                            ) );
                            ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
