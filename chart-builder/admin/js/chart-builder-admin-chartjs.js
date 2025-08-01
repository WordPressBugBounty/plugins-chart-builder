(function($) {
    'use strict';
    function ChartBuilderChartsJs(element, options){
        this.el = element;
        this.$el = $(element);
        this.ajaxAction = 'ays_chart_admin_ajax';
        this.htmlClassPrefix = 'ays-chart-';
        this.htmlNamePrefix = 'ays_';
        this.dbOptions = undefined;
        this.chartSourceData = undefined;
		this.chartObj = undefined;
		this.chartOptions = null;
		this.chartData = null;
		this.chartTempData = null;
		this.chartType = 'pie_chart';
		this.chartSourceType = 'chart-js';
        this.chartObject = null;

		this.chartSources = {
			'pie_chart'    : 'Pie Chart',
			'bar_chart'    : 'Bar Chart',
			'line_chart'   : 'Line Chart',
		}

        this.init();

        return this;
    }

    ChartBuilderChartsJs.prototype.init = function() {
        var _this = this;
		_this.chartSourceData = window.ChartBuilderSourceData;
        _this.setEvents();
        _this.initLibraries();
        _this.setAccordionEvents();
    };

	// Set events
    ChartBuilderChartsJs.prototype.setEvents = function(e){
        var _this = this;

        _this.chartType = _this.chartSourceData.chartType;
        _this.chartSourceType = _this.chartSourceData.chartSourceType;
        _this.chartData = _this.chartSourceData.source;
        _this.loadChartBySource();
        _this.configureOptions();
        _this.resizeChart();

		/* == Tabulation == */
			_this.$el.on('click', '.nav-tab-wrapper a.nav-tab' , _this.changeTabs);
		/* */

		/* == Notifications dismiss button == */
			_this.$el.on('click', '.notice-dismiss', function (e) {
				_this.changeCurrentUrl('status');
			});

			_this.$el.on('click', '.toggle_ddmenu' , _this.toggleDDmenu);
		/* */

		/* Add Manual data */
			_this.$el.on("click"  , '.'+_this.htmlClassPrefix+'add-new-row-box', function(){
				_this.addChartDataRow();
			});

			_this.$el.on("click"  , '.'+_this.htmlClassPrefix+'add-new-column-box', function(){
				_this.addChartDataColumn();
			});

			_this.$el.on('click', '.'+_this.htmlClassPrefix+'show-on-chart-bttn', function(e){		
				e.preventDefault();
                _this.showOnChart();
			});

		/* */

		/* Delete data */ 
			_this.$el.on("click"  , '.'+_this.htmlClassPrefix+'chart-source-data-remove-row', function(){
				_this.deleteChartDataRow($(this));
				_this.detectManualChange();
			});
			_this.$el.on("click"  , '.'+_this.htmlClassPrefix+'chart-source-data-remove-col', function(){
				_this.deleteChartDataColumn($(this));
				_this.detectManualChange();
			});
			_this.$el.on('mouseenter', '.'+_this.htmlClassPrefix+'chart-source-data-remove-block', function() {
				$(this).find('path').css('fill', '#ff0000');
			});
			_this.$el.on('mouseleave', '.'+_this.htmlClassPrefix+'chart-source-data-remove-block', function() {
				$(this).find('path').css('fill', '#b8b8b8');
			});
		/* */

		/* Save with Ctrl + S */
		_this.$el.on('keydown', $(document), _this.quickSaveHotKeys);
		/* */

		// Submit buttons disabling
		_this.$el.on('click', '.'+_this.htmlClassPrefix+'loader-banner', _this.submitOnce);
		/* */
		
		// Disabling submit when press enter button on inputing
		$(document).on("keypress", '.ays-text-input', _this.keyBoardConfig.bind(_this));
		/* */

		// Modal close
		$(document).on('click', '.ays-close', function () {
			$(this).parents('.ays-modal').aysModal('hide');
		});

		// Changing source type to manual
		_this.$el.on('input', '.'+_this.htmlClassPrefix+'chart-source-data-content input', function () {
			_this.detectManualChange();
		});

		// Shortcode text for editor tooltip
		$(document).find('strong.ays-chart-shortcode-box').on('mouseleave', function(){
			var _this = $(this);
	
			_this.attr('data-original-title', aysChartBuilderAdmin.clickForCopy);
			_this.attr("data-bs-original-title", aysChartBuilderAdmin.clickForCopy);
			_this.attr("title", aysChartBuilderAdmin.clickForCopy);
		});

		_this.$el.find('.'+_this.htmlClassPrefix+'toggle-hidden-option').on('change', function () {
			// var animationOptions = _this.$el.find('.'+_this.htmlClassPrefix+'hidden-options-section');
			var currentSettings = $(this).parents('.' + _this.htmlClassPrefix + 'settings-data-main-wrap')
			var hiddenSection = currentSettings.find('.' + _this.htmlClassPrefix + 'hidden-options-section');
			var notHiddenSection = currentSettings.find('.' + _this.htmlClassPrefix + 'not-hidden-options-section');

			if ($(this).is(':checked')) {
				hiddenSection.removeClass('display_none');
				notHiddenSection.addClass('display_none');
			} else {
				hiddenSection.addClass('display_none');
				notHiddenSection.removeClass('display_none');
			}
		});

		_this.$el.on("click", '.'+_this.htmlClassPrefix+'chart-source-data-sort', function(){
			_this.sortDataByColumn($(this));
			_this.detectManualChange();
		});

		// Live preview
		_this.liveSettingsPreview();
    }

	ChartBuilderChartsJs.prototype.liveSettingsPreview = function () {
		var _this = this;

		// title
			_this.$el.find('#ays-title').on('input', function () {
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').text($(this).val());
			});
		
		// description
			_this.$el.find('#'+_this.htmlClassPrefix+'description').on('input', function () {
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').text($(this).val());
			});

		// chart styles
			_this.$el.find('#'+_this.htmlClassPrefix+'option-width').on('input', function () {
				var format = _this.$el.find('#'+_this.htmlClassPrefix+'option-width-format').val() == '%' ? '%' : '';
				_this.chartSourceData.settings.chart_width =  $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('width', $(this).val() + format);
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-width-format').on('change', function () {
				var format = '%';
				if ($(this).val() == 'px') {
					format = '';
				}
				var value = _this.$el.find('#'+_this.htmlClassPrefix+'option-width').val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('width', value + format);
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-height').on('input', function () {
				var format = _this.$el.find('#'+_this.htmlClassPrefix+'option-height-format').val() == '%' ? '%' : '';
				_this.chartSourceData.settings.chart_height =  $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('height', $(this).val() + format);
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-height-format').on('change', function () {
				var format = '';
				if ($(this).val() == '%') {
					format = '%';
				}
				var value = _this.$el.find('#'+_this.htmlClassPrefix+'option-height').val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('height', value + format);
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-width').on('input', function () {
				_this.chartSourceData.settings.border_width = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('border-width', $(this).val() + 'px');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-radius').on('input', function () {
				_this.chartSourceData.settings.border_radius = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('border-radius', $(this).val() + 'px');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-color').on('input', function () {
				_this.chartSourceData.settings.border_color = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('border-color', $(this).val());
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-style').on('change', function () {
				_this.chartSourceData.settings.border_style = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('border-style', $(this).val());
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-background-color').on('input', function () {
				_this.chartSourceData.settings.background_color = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('background-color', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-width-with-title').on('input', function () {
				_this.chartSourceData.settings.border_width_with_title = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'container').css('border-width', $(this).val() + 'px');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-radius-with-title').on('input', function () {
				_this.chartSourceData.settings.border_radius_with_title = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'container').css('border-radius', $(this).val() + 'px');
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-color-with-title').on('input', function () {
				_this.chartSourceData.settings.border_color_with_title = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'container').css('border-color', $(this).val());
				_this.chartObject.update();
			});	
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-border-style-with-title').on('change', function () {
				_this.chartSourceData.settings.border_style_with_title = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'container').css('border-style', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-box-shadow').on('change', function () {
				if ($(this).is(':checked')) {
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('box-shadow', '2px 2px 10px 2px ' + _this.chartSourceData.settings.box_shadow_color);
				} else {
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('box-shadow', 'unset');
				}
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-box-shadow-color').on('input', function () {
				if (_this.$el.find('#'+_this.htmlClassPrefix+'option-box-shadow').is(':checked')) {
					_this.chartSourceData.settings.box_shadow_color = $(this).val();
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-main-container').css('box-shadow', '2px 2px 10px 2px ' + _this.chartSourceData.settings.box_shadow_color);
					_this.chartObject.update();
				}
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-padding-outer').on('input', function () {
				_this.chartSourceData.settings.padding_outer = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'container').css('padding', $(this).val() + 'px');
				_this.chartObject.update();
			});

		//title
			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-gap').on('input', function () {
				_this.chartSourceData.settings.title_gap = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'header-container').attr('style', 'margin-bottom: ' + $(this).val() + 'px' + ' !important;');
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-color').on('input', function () {
				_this.chartSourceData.settings.title_color = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('color', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-font-size').on('input', function () {
				_this.chartSourceData.settings.title_font_size = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('font-size', $(this).val() + 'px');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-bold').on('change', function () {
				_this.chartSourceData.settings.title_bold = $(this).is(':checked') ? 'checked' : '';
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('font-weight', $(this).is(':checked') ? 'bold' : 'normal');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-italic').on('change', function () {
				_this.chartSourceData.settings.title_italic = $(this).is(':checked') ? 'checked' : '';
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('font-style', $(this).is(':checked') ? 'italic' : 'normal');
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-text-shadow').on('change', function () {
				if ($(this).is(':checked')) {
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('text-shadow', '2px 2px 5px ' + _this.chartSourceData.settings.title_shadow_color);
				} else {
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('text-shadow', 'unset');
				}
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-shadow-color').on('input', function () {
				if (_this.$el.find('#'+_this.htmlClassPrefix+'option-title-text-shadow').is(':checked')) {
					_this.chartSourceData.settings.title_shadow_color = $(this).val();
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('text-shadow', '2px 2px 5px ' + $(this).val());
					_this.chartObject.update();
				}
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-position').on('change', function () {
				_this.chartSourceData.settings.title_position = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('text-align', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-text-transform').on('change', function () {
				_this.chartSourceData.settings.title_transform = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('text-transform', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-text-decoration').on('change', function () {
				_this.chartSourceData.settings.title_decoration = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('text-decoration', $(this).val());
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-letter-spacing').on('input', function () {
				_this.chartSourceData.settings.title_letter_spacing = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('letter-spacing', $(this).val() + 'px');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-title-gap-description').on('input', function () {
				_this.chartSourceData.settings.title_gap_description = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-title').css('margin-bottom', $(this).val() + 'px');
				_this.chartObject.update();
			});
			
		// description
			_this.$el.find('#'+_this.htmlClassPrefix+'description').on('input', function () {
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').text($(this).val());
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-color').on('input', function () {
				_this.chartSourceData.settings.description_color = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('color', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-font-size').on('input', function () {
				_this.chartSourceData.settings.description_font_size = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('font-size', $(this).val() + 'px');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-bold').on('change', function () {
				_this.chartSourceData.settings.description_bold = $(this).is(':checked') ? 'checked' : '';
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('font-weight', $(this).is(':checked') ? 'bold' : 'normal');
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-italic').on('change', function () {
				_this.chartSourceData.settings.description_italic = $(this).is(':checked') ? 'checked' : '';
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('font-style', $(this).is(':checked') ? 'italic' : 'normal');
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-text-shadow').on('change', function () {
				if ($(this).is(':checked')) {
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('text-shadow', '2px 2px 5px ' + _this.chartSourceData.settings.description_shadow_color);
				} else {
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('text-shadow', 'unset');
				}
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-shadow-color').on('input', function () {
				if (_this.$el.find('#'+_this.htmlClassPrefix+'option-description-text-shadow').is(':checked')) {
					_this.chartSourceData.settings.description_shadow_color = $(this).val();
					_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('text-shadow', '2px 2px 5px ' + $(this).val());
					_this.chartObject.update();
				}
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-position').on('change', function () {
				_this.chartSourceData.settings.description_position = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('text-align', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-text-transform').on('change', function () {
				_this.chartSourceData.settings.description_transform = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('text-transform', $(this).val());
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-text-decoration').on('change', function () {
				_this.chartSourceData.settings.description_decoration = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('text-decoration', $(this).val());
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-description-letter-spacing').on('input', function () {
				_this.chartSourceData.settings.description_letter_spacing = $(this).val();
				_this.$el.find('.'+_this.htmlClassPrefix+'charts-description').css('letter-spacing', $(this).val() + 'px');
				_this.chartObject.update();
			});

		// advanced options
			_this.$el.find('#'+_this.htmlClassPrefix+'option-outer-radius').on('input', function () {
				_this.chartSourceData.settings.outer_radius = $(this).val();
				_this.chartObject.options.radius = _this.chartSourceData.settings.outer_radius;
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-slice-spacing').on('input', function () {
				_this.chartSourceData.settings.slice_spacing = $(this).val();
				_this.chartObject.options.spacing = _this.chartSourceData.settings.slice_spacing;
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-circumference').on('input', function () {
				_this.chartSourceData.settings.circumference = $(this).val();
				_this.chartObject.options.circumference = _this.chartSourceData.settings.circumference;
				_this.chartObject.update();
			});
			
			_this.$el.find('#'+_this.htmlClassPrefix+'option-start-angle').on('input', function () {
				_this.chartSourceData.settings.start_angle = $(this).val();
				_this.chartObject.options.rotation = _this.chartSourceData.settings.start_angle;
				_this.chartObject.update();
			});

		// Slices settings
			_this.$el.find('.'+_this.htmlClassPrefix+'option-slice-color').on('input', function () {
				var id = $(this).attr('data-slice-id');
				_this.chartSourceData.settings.slice_color[id] = $(this).val();
				if (_this.chartObject.data.datasets[0].backgroundColor) {
					_this.chartObject.data.datasets[0].backgroundColor[id] = $(this).val();
				}
				_this.chartObject.update();
			});

			_this.$el.find('.'+_this.htmlClassPrefix+'option-slice-border-color').on('input', function () {
				var id = $(this).attr('data-slice-id');
				_this.chartSourceData.settings.slices_border_color[id] = $(this).val();
				if (_this.chartObject.data.datasets[0].borderColor) {
					_this.chartObject.data.datasets[0].borderColor[id] = $(this).val();
				}
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-slice-border-color').on('input', function () {
				_this.chartSourceData.settings.slice_border_color = $(this).val();
				_this.chartObject.options.borderColor = _this.chartSourceData.settings.slice_border_color;
				_this.chartObject.update();
			});

			_this.$el.find('#' + _this.htmlClassPrefix + 'option-slice-border-width').on('input', function () {
				const val = parseInt($(this).val(), 10) || 0;
				_this.chartSourceData.settings.slice_border_width = val;
				_this.chartObject.data.datasets[0].borderWidth = val;
				_this.chartObject.update();
			});

		//tooltip settings
			_this.$el.find('#'+_this.htmlClassPrefix+'option-tooltip-text-color').on('input', function () {
				_this.chartSourceData.settings.tooltip_text_color = $(this).val();
				_this.chartObject.options.plugins.tooltip.titleColor = _this.chartSourceData.settings.tooltip_text_color;
				_this.chartObject.options.plugins.tooltip.bodyColor = _this.chartSourceData.settings.tooltip_text_color;
				_this.chartObject.update();
			});

		// legend settings
			_this.$el.find('#'+_this.htmlClassPrefix+'option-legend-position').on('change', function () {
				_this.chartSourceData.settings.legend_position = $(this).val();
				_this.chartObject.options.plugins.legend.position = _this.chartSourceData.settings.legend_position;
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-legend-alignment').on('change', function () {
				_this.chartSourceData.settings.legend_alignment = $(this).val();
				_this.chartObject.options.plugins.legend.align = _this.chartSourceData.settings.legend_alignment;
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-legend-font-color').on('input', function () {
				_this.chartSourceData.settings.legend_font_color = $(this).val();
				_this.chartObject.options.plugins.legend.labels.color = _this.chartSourceData.settings.legend_font_color;
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-legend-font-size').on('input', function () {
				_this.chartSourceData.settings.legend_font_size = $(this).val();
				_this.chartObject.options.plugins.legend.labels.font.size = _this.chartSourceData.settings.legend_font_size;
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-legend-reverse').on('change', function () {
				_this.chartSourceData.settings.legend_reverse = $(this).is(':checked');
				_this.chartObject.options.plugins.legend.reverse = _this.chartSourceData.settings.legend_reverse ? 'checked' : '';
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-legend-italic').on('change', function () {
				_this.chartSourceData.settings.legend_italic =  $(this).is(':checked');
				_this.chartObject.options.plugins.legend.labels.font.style = _this.chartSourceData.settings.legend_italic ? 'italic' : 'normal';
				_this.chartObject.update();
			});

			_this.$el.find('#'+_this.htmlClassPrefix+'option-legend-bold').on('change', function () {
				_this.chartSourceData.settings.legend_bold = $(this).is(':checked');
				_this.chartObject.options.plugins.legend.labels.font.weight = _this.chartSourceData.settings.legend_bold ? 'bold' : 'normal';
				_this.chartObject.update();
			});

	}

	ChartBuilderChartsJs.prototype.detectManualChange = function (e) {
		var input = $(document).find('input[name="ays_source_type"]');
		if (input.val() !== 'manual') input.val('manual'); 	
	}

	ChartBuilderChartsJs.prototype.keyBoardConfig = function(e) {
		if (e.which == 13) {
			if ($(document).find("#ays-charts-form-chart-js").length !== 0 || $(document).find("#ays-settings-form").length !== 0) {
				var parent = $(e.target).parents('.ays-chart-chart-source-data-edit-block');
				var index = $(e.target).parents('.ays-chart-chart-source-data-input-box').index();
				index = parent.index() == 0 ? index - 1 : index - 2;
	
				if (e.shiftKey) {
					var prevRow;
					if (parent.prev('.ays-chart-chart-source-data-edit-block').length === 0) {
						return false;
					}
					prevRow = parent.prev('.ays-chart-chart-source-data-edit-block');
	
					prevRow.children('.ays-chart-chart-source-data-input-box').eq(index).find('.ays-text-input').focus();
				} else {
					var nextRow;
					if (parent.next('.ays-chart-chart-source-data-edit-block').length === 0) {
						this.addChartDataRow();
					}
					nextRow = parent.next('.ays-chart-chart-source-data-edit-block');
	
					nextRow.children('.ays-chart-chart-source-data-input-box').eq(index).find('.ays-text-input').focus();
				}
	
				return false;
			}
		}
	}

	// Change tabs (tabulation)
	ChartBuilderChartsJs.prototype.changeTabs = function(e){
		if(! $(this).hasClass('no-js')){
			var elemenetID = $(this).attr('href');
			var active_tab = $(this).attr('data-tab');
			$(document).find('.nav-tab-wrapper a.nav-tab').each(function () {
				if ($(this).hasClass('nav-tab-active')) {
					$(this).removeClass('nav-tab-active');
				}
			});
			$(this).addClass('nav-tab-active');
			$(document).find('.ays-tab-content').each(function () {
				$(this).removeClass('ays-tab-content-active');
			});
			$(document).find("[name='ays_chart_tab']").val(active_tab);
			$('.ays-tab-content' + elemenetID).addClass('ays-tab-content-active');
			e.preventDefault();
		}
	}

	ChartBuilderChartsJs.prototype.changeCurrentUrl = function(key){
		var linkModified = location.href.split('?')[1].split('&');
		for(var i = 0; i < linkModified.length; i++){
			if(linkModified[i].split("=")[0] == key){
				linkModified.splice(i, 1);
			}
		}
		linkModified = linkModified.join('&');
		window.history.replaceState({}, document.title, '?'+linkModified);
	}

	ChartBuilderChartsJs.prototype.toggleDDmenu = function(e){
		var ddmenu = $(this).next();
		var state = ddmenu.attr('data-expanded');
		switch (state) {
			case 'true':
				$(this).find('.ays_fa').css({
					transform: 'rotate(0deg)'
				});
				ddmenu.attr('data-expanded', 'false');
				break;
			case 'false':
				$(this).find('.ays_fa').css({
					transform: 'rotate(90deg)'
				});
				ddmenu.attr('data-expanded', 'true');
				break;
		}
	}

	ChartBuilderChartsJs.prototype.submitOnce = function(el) {
        setTimeout(function() {
			$(document).find('.ays-chart-loader-banner').attr('disabled', true);
        }, 50);

        setTimeout(function() {
            $(document).find('.ays-chart-loader-banner').attr('disabled', false);
        }, 5000);
	}

	// Load charts by given type main function
	ChartBuilderChartsJs.prototype.initLibraries = function (){
		var _this = this;

		_this.$el.find('#ays-chart-option-create-author').select2({
			placeholder: aysChartBuilderAdmin.selectUser,
			minimumInputLength: 1,
			allowClear: true,
			language: {
				searching: function() {
					return aysChartBuilderAdmin.searching;
				},
				inputTooShort: function () {
					return aysChartBuilderAdmin.pleaseEnterMore;
				}
			},
			ajax: {
				url: ajaxurl,
				dataType: 'json',
				data: function (response) {
					var checkedUsers = _this.$el.find('#ays-chart-option-create-author').val();
					return {
						action: _this.ajaxAction,
						function: window.aysChartBuilderChartSettings.ajax['actions']['author_user_search'],
						security: window.aysChartBuilderChartSettings.ajax['nonces']['author_user_search'],
						params: {
							search: response.term,
							val: checkedUsers
						}
					};
				}
			}
		});

		_this.$el.find('.' + _this.htmlClassPrefix + 'chart-source-data-content').sortable({
			items: "> div." + _this.htmlClassPrefix + "chart-source-data-edit-block:not(:first)",
			handle: "." + _this.htmlClassPrefix + "chart-source-data-move-row",
            update: function (event, ui) {
                _this.$el.find('div.' + _this.htmlClassPrefix + 'chart-source-data-edit-block:not(:first)').each(function (index) {
					$(this).attr('data-source-id', index + 1);
					$(this).find("input.ays-text-input").attr('name', 'ays_chart_source_data[' + (index + 1) + '][]')
                });
            }
		});
	}

	// Load charts by given type main function
	ChartBuilderChartsJs.prototype.loadChartBySource = function(isChangedType = false){
		var _this = this;

		if( ! _this.chartType ){
			_this.chartType = _this.chartSourceData.chartType;
		}

		if(typeof _this.chartType !== undefined && _this.chartType){
			switch (_this.chartType) {
				case 'pie_chart':
					_this.pieChartView(isChangedType);
					break;
				case 'bar_chart':
					_this.barChartView(isChangedType);
					break;
				case 'line_chart':
					_this.lineChartView(isChangedType);
					break;
				default:
					_this.pieChartView(isChangedType);
					break;
			}
		}		
	}

	Chart.register({
		id: 'hoverGlowPlugin',
		beforeDraw(chart) {
			if (chart.config.type !== 'pie') {
				return;
			}
			const ctx = chart.ctx;
			const activeElements = chart.getActiveElements();
			
			if (activeElements.length === 0) {
				return;
			}
			const meta = chart.getDatasetMeta(activeElements[0].datasetIndex);
			const element = meta.data[activeElements[0].index];

			if (!element) {
				return;
			}
			const sliceColor = element.options.backgroundColor || 'rgba(0, 0, 0, 1)';
			ctx.save();
			ctx.shadowColor = sliceColor;
			ctx.shadowBlur = 15;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;

			element.draw(ctx);
			ctx.restore();
		}
	});

	// Load chart by pie chart
	ChartBuilderChartsJs.prototype.pieChartView = function(isChangedType){
		var _this = this;
		var getChartSource = _this.chartSourceData.source;

		var dataTypes = _this.chartConvertData( getChartSource );

        var settings = _this.chartSourceData.settings;
		var nSettings =  _this.configOptionsForCharts(settings);
        
		var ctx = document.getElementById(_this.htmlClassPrefix + '-canvas');

		ctx.width = nSettings.chartWidth;
		ctx.height = nSettings.chartHeight;

		if (nSettings.chartWidthFormat === 'px') {
			ctx.width = parseInt(nSettings.chartWidth);
		} else if (nSettings.chartWidthFormat === '%') {
			ctx.style.width = nSettings.chartWidth + '%';
		}

		if (nSettings.chartHeightFormat === 'px') {
			ctx.height = parseInt(nSettings.chartHeight);
		} else if (nSettings.chartHeightFormat === '%') {
			ctx.style.height = nSettings.chartHeight + '%';
		}

		var sliceCount = dataTypes?.dataSets[0]?.data?.length || 0;
		dataTypes.dataSets[0].backgroundColor = [];
		dataTypes.dataSets[0].borderColor = [];

		for (var i = 0; i < sliceCount; i++) {
			dataTypes.dataSets[0].backgroundColor[i] = nSettings.sliceColor?.[i] || nSettings.sliceColorDefault?.[i % nSettings.sliceColorDefault.length];
			dataTypes.dataSets[0].borderColor[i] = nSettings.slicesBorderColor?.[i] || 'transparent';
		}
		dataTypes.dataSets[0].borderWidth = nSettings.sliceBorderWidth;
		_this.chartObject = new Chart(ctx, {
		  type: 'pie',
		  data: {
			labels: dataTypes?.labels,
			datasets: dataTypes?.dataSets,
		  },
		  options: {
			radius: nSettings.outerRadius,
			spacing: nSettings.sliceSpacing,
			circumference: nSettings.circumference,
			rotation: nSettings.startAngle,
			borderColor: nSettings.sliceBorderColor,
			plugins: {
				maintainAspectRatio: false,
				tooltip:{
					titleColor: nSettings.tooltipColor,
					bodyColor: nSettings.tooltipColor,
					footerColor: nSettings.tooltipColor,
					position: 'nearest',
				},
				legend: {
					position: nSettings.legendPosition,
					reverse: nSettings.legendReverse,
					align: nSettings.legendAlignment,
					labels: {
						color: nSettings.legendColor,
						font: {
							size: nSettings.legendFontSize,
							weight: nSettings.legendBoldText ? 'bold' : 'normal',
            				style: nSettings.legendItalicText ? 'italic' : 'normal'
						}
					}
				}
  			}
		  }
		});

        _this.resizeChart();
	}

	// Load chart by bar chart
	ChartBuilderChartsJs.prototype.barChartView = function(isChangedType){
		var _this = this;
		var getChartSource = _this.chartSourceData.source;

		var dataTypes = _this.chartConvertData( getChartSource );

        var settings = _this.chartSourceData.settings;
		var nSettings =  _this.configOptionsForCharts(settings);
        
		var ctx = document.getElementById(_this.htmlClassPrefix + '-canvas');

		ctx.width = nSettings.chartWidth;
		ctx.height = nSettings.chartHeight;

		if (nSettings.chartWidthFormat === 'px') {
			ctx.width = parseInt(nSettings.chartWidth);
		} else if (nSettings.chartWidthFormat === '%') {
			ctx.style.width = nSettings.chartWidth + '%';
		}

		if (nSettings.chartHeightFormat === 'px') {
			ctx.height = parseInt(nSettings.chartHeight);
		} else if (nSettings.chartHeightFormat === '%') {
			ctx.style.height = nSettings.chartHeight + '%';
		}

		_this.chartObject = new Chart(ctx, {
		  type: 'bar',
		  data: {
			labels: dataTypes?.labels,
			datasets: dataTypes?.dataSets,
		  },
		  options: {
    		maintainAspectRatio: false,
			// indexAxis: nSettings.indexAxis,
			plugins: {
				tooltip:{
					titleColor: nSettings.tooltipColor,
					bodyColor: nSettings.tooltipColor,
					footerColor: nSettings.tooltipColor,
				},
				legend: {
					position: nSettings.legendPosition,
					align: nSettings.legendAlignment,
					labels: {
						color: nSettings.legendColor,
						font: {
							size: nSettings.legendFontSize,
							weight: nSettings.legendBoldText ? 'bold' : 'normal',
            				style: nSettings.legendItalicText ? 'italic' : 'normal'
						}
					}
				}
  			}
		  }
		});

        _this.resizeChart();
	}

	// Load chart by line chart
	ChartBuilderChartsJs.prototype.lineChartView = function(isChangedType){
		var _this = this;
		var getChartSource = _this.chartSourceData.source;

		var dataTypes = _this.chartConvertData( getChartSource );

        var settings = _this.chartSourceData.settings;
		var nSettings =  _this.configOptionsForCharts(settings);
        
		var ctx = document.getElementById(_this.htmlClassPrefix + '-canvas');

		ctx.width = nSettings.chartWidth;
		ctx.height = nSettings.chartHeight;

		if (nSettings.chartWidthFormat === 'px') {
			ctx.width = parseInt(nSettings.chartWidth);
		} else if (nSettings.chartWidthFormat === '%') {
			ctx.style.width = nSettings.chartWidth + '%';
		}

		if (nSettings.chartHeightFormat === 'px') {
			ctx.height = parseInt(nSettings.chartHeight);
		} else if (nSettings.chartHeightFormat === '%') {
			ctx.style.height = nSettings.chartHeight + '%';
		}
		_this.chartObject = new Chart(ctx, {
		  type: 'line',
		  data: {
			labels: dataTypes?.labels,
			datasets: dataTypes?.dataSets,
		  },
		  options: {
    		maintainAspectRatio: false,
			// indexAxis: nSettings.indexAxis,
			plugins: {
				tooltip:{
					titleColor: nSettings.tooltipColor,
					bodyColor: nSettings.tooltipColor,
					footerColor: nSettings.tooltipColor,
				},
				legend: {
					position: nSettings.legendPosition,
					align: nSettings.legendAlignment,
					labels: {
						color: nSettings.legendColor,
						font: {
							size: nSettings.legendFontSize,
							weight: nSettings.legendBoldText ? 'bold' : 'normal',
            				style: nSettings.legendItalicText ? 'italic' : 'normal'
						}
					}
				}
  			}
		  }
		});

        _this.resizeChart();
	}

	/* 
	  Configure all settings for all chart types
	  Getting settings for each chart type in respective function 
	*/
	ChartBuilderChartsJs.prototype.configOptionsForCharts = function (settings) {
		var newSettings = {};

		// newSettings.indexAxis = (settings['index_axis'] == 'checked') ? 'y' : 'x';
		newSettings.chartWidth = parseInt(settings['chart_width']);  
		newSettings.chartWidthFormat = settings['chart_width_format']; 
		newSettings.chartHeight = settings['chart_height'];
		newSettings.chartHeightFormat = settings['chart_height_format']; 
		newSettings.outerRadius = settings['outer_radius'];
		newSettings.sliceSpacing = settings['slice_spacing'];
		newSettings.circumference = settings['circumference'];
		newSettings.startAngle = settings['start_angle'];
		newSettings.sliceColor = settings['slice_color'];
		newSettings.slicesBorderColor = settings['slices_border_color'];
		newSettings.sliceColorDefault = settings['slice_colors_default'];
		newSettings.sliceBorderWidth = settings['slice_border_width'];
		newSettings.sliceBorderColor = settings['slice_border_color'];
		newSettings.legendColor = settings['legend_color'];
		newSettings.legendPosition = settings['legend_position'];
		newSettings.legendAlignment = settings['legend_alignment'];
		newSettings.legendFontSize = settings['legend_font_size'];
		newSettings.legendItalicText = (settings['legend_italic'] == 'checked') ? true : false;
		newSettings.legendBoldText = (settings['legend_bold'] == 'checked') ? true : false;
		newSettings.legendReverse = settings['legend_reverse'];
		newSettings.tooltipColor = settings['tooltip_text_color'];
		return newSettings;
	}

	// Detect window resize moment to draw charts responsively 
	ChartBuilderChartsJs.prototype.resizeChart = function(){
		var _this = this;

		//create trigger to resizeEnd event     
		$(window).resize(function() {
			if(this.resizeTO) clearTimeout(this.resizeTO);
			this.resizeTO = setTimeout(function() {
				$(this).trigger('resizeEnd');
			}, 100);
		});
	
		//redraw graph when window resize is completed  
		$(window).on('resizeEnd', function() {
            _this.chartObject.resize();
		});
		
	}

	ChartBuilderChartsJs.prototype.chartConvertData = function( data ){
		var _this = this;
        var dataTypes = [];
        
        var dataTypes = Array.from({ length: data[0].length }, () => []);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                if (i === 0) {
                    dataTypes[j].push(data[i][j]);
                } else {
                    dataTypes[j].push(i === 0 || j === 0 ? data[i][j] : +data[i][j]);
                }
            }
        }

        var labels = dataTypes.shift();
        labels.shift();
        var dataSets = dataTypes.map(item => ({
            label: item[0],
            data: item.slice(1).map(Number),
        }));

        return {labels, dataSets};
	}

	// Update chart data and display immediately
	ChartBuilderChartsJs.prototype.updateChartData =  function(){
		var _this = this;
        var newData = _this.chartConvertData( _this.chartData );

        _this.chartObject.data = {
            ..._this.chartObject.data,
			labels: newData?.labels,
			datasets: newData?.dataSets,
		  },
		_this.chartObject.update();
	}

	ChartBuilderChartsJs.prototype.addChartDataRow = function (element){
        var _this = this;
        var content = '';

        var addedTermsandConds = this.$el.find("."+this.htmlClassPrefix+"chart-source-data-edit-block");
        var addedTermsandCondsId = this.$el.find("."+this.htmlClassPrefix+"chart-source-data-edit-block:last-child");
        var dataId = addedTermsandConds.length >= 1 ? addedTermsandCondsId.data("sourceId") + 1 : 1;
		var colCount = addedTermsandConds.first().children().length - 1;

        var termsCondsMessageAttrName = this.newTermsCondsMessageAttrName(  this.htmlNamePrefix + 'chart_source_data' ,  dataId );

		content += '<div class = "'+this.htmlClassPrefix+'chart-source-data-edit-block" data-source-id="' + dataId + '" >';
			content += '<div class="'+this.htmlClassPrefix+'chart-source-data-move-block '+this.htmlClassPrefix+'chart-source-data-move-row">';
				content += '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4V224H109.3l9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4H224V402.7l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4V288H402.7l-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4H288V109.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" style="fill: #b8b8b8;" /></svg>';
			content += '</div>';
			content += '<div class="'+this.htmlClassPrefix+'icons-box '+this.htmlClassPrefix+'icons-remove-box">';
				content += '<svg class="'+this.htmlClassPrefix+'chart-source-data-remove-block '+this.htmlClassPrefix+'chart-source-data-remove-row" data-trigger="hover" data-bs-toggle="tooltip" title="Delete row" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" style="fill: #b8b8b8;" /></svg>';
			content += '</div>';
			for (var i = 0; i < colCount; i++) {
				if (i == 0) {
					content += '<div class="'+this.htmlClassPrefix+'chart-source-data-input-box '+this.htmlClassPrefix+'chart-source-data-name-input-box" data-cell-id="'+i+'">';
						content += '<input type="text" class="ays-text-input form-control" name="' + termsCondsMessageAttrName + '">';
					content += '</div>';
				} else {
					content += '<div class="'+this.htmlClassPrefix+'chart-source-data-input-box '+this.htmlClassPrefix+'chart-source-data-input-number" data-cell-id="'+i+'">';
						content += '<input type="number" class="ays-text-input form-control" name="' + termsCondsMessageAttrName + '" step="any">';
					content += '</div>';
				}
			}
		content += '</div>';

		this.$el.find('.'+this.htmlClassPrefix+'chart-source-data-content').append(content);
		$('[data-bs-toggle="tooltip"]').tooltip();
	}

	ChartBuilderChartsJs.prototype.addChartDataColumn = function (e){
		var _this = this;

		var rows = _this.$el.find("."+_this.htmlClassPrefix+"chart-source-data-content").children();
		var lastColId = +$(rows[0]).find('.'+_this.htmlClassPrefix+'chart-source-data-input-box:last-child').attr('data-cell-id');
		rows.each(function(key, row){
			var dataIDEach = row.getAttribute('data-source-id');
			var content = '';

			if (key === 0) {
				content += '<div class="'+_this.htmlClassPrefix+'chart-source-data-input-box ' +_this.htmlClassPrefix+'chart-source-title-box" data-cell-id="'+(lastColId+1)+'">';
					content += '<svg class="'+_this.htmlClassPrefix+'chart-source-data-remove-block '+_this.htmlClassPrefix+'chart-source-data-remove-col" data-trigger="hover" data-bs-toggle="tooltip" title="Delete column" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="10px">';
						content += '<path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" style="fill: #b8b8b8;" />';
					content += '</svg>';

					content += '<div class="' + _this.htmlClassPrefix + 'chart-source-data-titles-box-item">';
						content += '<input type="text" class="ays-text-input form-control ' + _this.htmlClassPrefix+'chart-source-title-input" name="' + _this.newTermsCondsMessageAttrName(  _this.htmlNamePrefix + 'chart_source_data' ,  dataIDEach ) + '">';
						content += '<svg class="' + _this.htmlClassPrefix + 'chart-source-data-sort" data-sort-order="asc" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">';
							content += '<path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" style="fill: #b8b8b8;" />';
						content += '</svg>';
					content += '</div>'
				content += '</div>';
			} else {
				content += '<div class="'+_this.htmlClassPrefix+'chart-source-data-input-box ' +_this.htmlClassPrefix+'chart-source-data-input-number" data-cell-id="'+(lastColId+1)+'">';
					content += '<input type="number" class="ays-text-input form-control" name="' + _this.newTermsCondsMessageAttrName(  _this.htmlNamePrefix + 'chart_source_data' ,  dataIDEach ) + '" step="any">';
				content += '</div>';
			}

			$(row).append(content);
			$('[data-bs-toggle="tooltip"]').tooltip();
		});
	}

	ChartBuilderChartsJs.prototype.deleteChartDataRow = function (element){
		var _this = this;

		var rows = _this.$el.find("."+_this.htmlClassPrefix+"chart-source-data-content").children();
		if ((rows.length - 1) >= 2) {
			var confirm = window.confirm(aysChartBuilderAdmin.confirmRowDelete);
			if (confirm) {
				var thisMainParent = element.parent().parent();
				thisMainParent.remove();
			}
		} else {
			alert(aysChartBuilderAdmin.minRowNotice);
		}

		element.blur();
		element.tooltip('hide');
	}

	ChartBuilderChartsJs.prototype.deleteChartDataColumn = function (element){
		var _this = this;

		var rows = _this.$el.find("."+_this.htmlClassPrefix+"chart-source-data-content").children();
		if (rows.eq(1).children('.ays-chart-chart-source-data-input-number').length >= 2) {
			var confirm = window.confirm(aysChartBuilderAdmin.confirmColDelete);
			if (confirm) {
				var parent = element.parents('.ays-chart-chart-source-title-box');
				var index = _this.returnIndexOfEl(parent);
				rows.each(function(key, row){
					var dataRow = $(row).find('.ays-chart-chart-source-data-input-box:not("ays-chart-chart-source-data-name-input-box")');
					$(dataRow).each(function(ind, cell){
						if (ind == index) {
							$(cell).remove();
						}
					});
				});
			}
		} else {
			alert(aysChartBuilderAdmin.minColNotice);
		}

		element.blur();
		element.tooltip('hide');
	}
	
	ChartBuilderChartsJs.prototype.sortDataByColumn = function (el) {
		var _this = this;

		var sortingOrder = el.attr('data-sort-order');
		var colFirst = el.parents('.'+_this.htmlClassPrefix+'chart-source-data-input-box');
		var colIndex = colFirst.attr('data-cell-id');
		var colList = colFirst.parents('.'+_this.htmlClassPrefix+'chart-source-data-content').find('.'+_this.htmlClassPrefix+'chart-source-data-input-box[data-cell-id="'+colIndex+'"] input.ays-text-input');

		var sorted = {};
		colList.each(function(key, input){
			if (key !== 0) {
				var rowIndex = $(input).parents('.'+_this.htmlClassPrefix+'chart-source-data-edit-block').attr('data-source-id');
				sorted[rowIndex] = +input.value
			}
		});
		
		if (sortingOrder === 'asc') {
			sorted = _this.sortDataAsc(sorted);
			el.attr('data-sort-order', 'desc');
		} else if (sortingOrder === 'desc') {
			sorted = _this.sortDataDesc(sorted);
			el.attr('data-sort-order', 'asc');
		} else {
			sorted = _this.sortDataAsc(sorted);
			el.attr('data-sort-order', 'desc');
		}
		
		var container = _this.$el.find('.'+_this.htmlClassPrefix+'chart-source-data-content');
		var newContainer = [];
		sorted.forEach((index, newIndex) => {
			var row = container.find("."+_this.htmlClassPrefix+"chart-source-data-edit-block[data-source-id='"+index+"']");
			var inputs = row.find('input.ays-text-input');
			var inputName =  _this.newTermsCondsMessageAttrName(_this.htmlNamePrefix + 'chart_source_data', newIndex + 1);
			
			$(inputs).each(function (inputIndex, input) {
				input.setAttribute('name', inputName);
			});

			newContainer.push(row);
		});
		sorted.forEach((index, newIndex) => {
			var row = container.find("."+_this.htmlClassPrefix+"chart-source-data-edit-block[data-source-id='"+index+"']");
			newContainer.push(row);
		});
		
		container.innerHTML = '';
		newContainer.forEach(row => {
			container.append(row);
		});

		var rows = container.find("."+_this.htmlClassPrefix+"chart-source-data-edit-block");
		for (var i = 0; i < rows.length; i++) {
			$(rows[i]).attr('data-source-id', i);
		}
	}

	ChartBuilderChartsJs.prototype.sortDataAsc = function (data) {
		return Object.keys(data).sort(function (a, b) {return data[a] - data[b]});
	}

	ChartBuilderChartsJs.prototype.sortDataDesc = function (data) {
		return Object.keys(data).sort(function (a, b) {return data[b] - data[a]});
	}
	
	ChartBuilderChartsJs.prototype.returnIndexOfEl = function (element){
		var i = 0;
		var elements = element.parent().find('.ays-chart-chart-source-title-box');
		elements.each(function(key, cell){
			if ($(cell).is(element)) {
				i = key;
			}
		});
		return i;
	}

	ChartBuilderChartsJs.prototype.configureOptions = function() {
        var _this = this;

		_this.$el.find('.ays-chart-chart-source-title-box').eq(0).find('.ays-chart-chart-source-data-remove-block').css('visibility', 'hidden');

		var removeCols = _this.$el.find('.ays-chart-chart-source-title-box').find('.ays-chart-chart-source-data-remove-block');
		if (_this.chartType === 'pie_chart') {
			removeCols.css('visibility', 'hidden');
		}
		
		var options = _this.$el.find('.cb-changable-opt');
		var typeOptions = _this.$el.find('.cb-'+_this.chartType+'-opt');
		options.addClass('display_none');
		typeOptions.removeClass('display_none');
		
		var manualTabs = _this.$el.find('.cb-changable-manual:not(.cb-'+_this.chartType+'-manual)');
		var typeManualTab = _this.$el.find('.cb-'+_this.chartType+'-manual');
		manualTabs.remove();
		typeManualTab.removeClass('display_none');
		
		var tabs = _this.$el.find('.cb-changable-tab:not(.cb-'+_this.chartType+'-tab)').parents('fieldset.ays-accordion-options-container');
		var currentTabs = _this.$el.find('.cb-'+_this.chartType+'-tab').parents('fieldset.ays-accordion-options-container');
		tabs.addClass('display_none');
		currentTabs.removeClass('display_none');
	}

	ChartBuilderChartsJs.prototype.newTermsCondsMessageAttrName = function (termCondName, termCondId){
		var _this = this;
		return termCondName + '['+ termCondId +'][]';	
	}
    
    ChartBuilderChartsJs.prototype.setAccordionEvents = function(e){
        var _this = this;

        _this.$el.on('click', '.ays-accordion-options-header', function(e){
			_this.openCloseAccordion(e, _this);
		});

		_this.$el.on('click', '.ays-slices-accordion-options-header', function(e){
			_this.openCloseAccordion(e, _this, '-slices');
		});
		
		_this.$el.on('click', '.ays-series-accordion-options-header', function(e){
			_this.openCloseAccordion(e, _this, '-series');
		});
		
		_this.$el.on('click', '.ays-rows-accordion-options-header', function(e){
			_this.openCloseAccordion(e, _this, '-rows');
		});
    }
	
	ChartBuilderChartsJs.prototype.openCloseAccordion = function(e, _this, contType = ""){
		var container = $(e.target).parents('.ays' + contType + '-accordion-options-container');
		var parent = (contType != "") ? container.parents('.ays-chart' + contType + '-settings') : _this.$el.find('#' + container.parents('.ays-tab-content').attr('id') + ' .ays-accordions-container').eq(0);
		var index = (contType != "") ? container.index() : -1;

        if( container.attr('data-collapsed') === 'true' ){
			_this.closeAllAccordions( parent, contType, index );
			setTimeout(() => {
				container.find('.ays' + contType + '-accordion-options-content').slideDown();
				container.attr('data-collapsed', 'false');
				container.find('.ays' + contType + '-accordion-options-header .ays' + contType + '-accordion-arrow').find('path').css('fill', '#008cff');
				container.find('.ays' + contType + '-accordion-options-header .ays' + contType + '-accordion-arrow').removeClass('ays' + contType + '-accordion-arrow-right').addClass('ays' + contType + '-accordion-arrow-down');
			}, 150);
        }else{
			setTimeout(() => {
				container.find('.ays' + contType + '-accordion-options-content').slideUp();
				container.attr('data-collapsed', 'true');
				container.find('.ays' + contType + '-accordion-options-header .ays' + contType + '-accordion-arrow').find('path').css('fill', '#c4c4c4');
				container.find('.ays' + contType + '-accordion-options-header .ays' + contType + '-accordion-arrow').removeClass('ays' + contType + '-accordion-arrow-down').addClass('ays' + contType + '-accordion-arrow-right');
			}, 150);
        }
    }
    
    ChartBuilderChartsJs.prototype.closeAllAccordions = function( container, contType, index ){
		var _this = this;

		container.find('.ays' + contType + '-accordion-options-container').each(function (i){
			var $this = $(this);
			if (i != index) {
				setTimeout(() => {
					$this.find('.ays' + contType + '-accordion-options-content').slideUp();
					$this.attr('data-collapsed', 'true');
					$this.find('.ays' + contType + '-accordion-options-header .ays' + contType + '-accordion-arrow').find('path').css('fill', '#c4c4c4');
					$this.find('.ays' + contType + '-accordion-options-header .ays' + contType + '-accordion-arrow').removeClass('ays' + contType + '-accordion-arrow-down').addClass('ays' + contType + '-accordion-arrow-right');
				}, 150);
			}
		});
    }

	ChartBuilderChartsJs.prototype.quickSaveHotKeys = function() {
		$(document).on('keydown', function(e){
			var saveButton = $(document).find('input#ays-button-apply');
			if ( saveButton.length > 0 ) {
                if (!(e.which == 83 && e.ctrlKey) && !(e.which == 19)){
                    return true;
                }
                saveButton.trigger("click");
                e.preventDefault();
                return false;
            }
		});
	}

	// Manual data preview button
	ChartBuilderChartsJs.prototype.showOnChart = function () { // TODO
		var _this = this;
		
		var lastId = $(document).find(".ays-chart-chart-source-data-edit-block:last-child").attr('data-source-id');
		var chartData = [];

		var rowTitles = $(document).find('.ays-chart-chart-source-data-name-input-box');
		rowTitles.each(function(key, el) {
			var value = $(el).find('input').val();
			if ( value == '' ) {
				$(el).find('input').val('Option');
			}
		});

		var form = $(document).find("#ays-charts-form-chart-js");
		var data = form.serializeFormJSON();

		for (var i = 0; i <= lastId; i++) {
			if (data['ays_chart_source_data['+i+'][]'] !== undefined) {
				var dataRow = data['ays_chart_source_data['+i+'][]'];
				var filteredRow = [];
				for (var key = 0; key < dataRow.length; key++) {
					var value = dataRow[key];
					if (value != '') {
						filteredRow.push(value);
					} else {
						if (i == 0) {
							filteredRow.push('Title'+key);
						} else {
							filteredRow.push('0');
						}
					}
				}
				if (filteredRow.length != 0) {
					chartData.push(filteredRow);
				}
			}
		}

		_this.chartData = chartData;
		_this.updateChartData();
	}

	ChartBuilderChartsJs.prototype.htmlDecode = function (input) {
		if (!input) return input;

		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	}

	$.fn.ChartBuilderChartsJsMain = function(options) {
        return this.each(function() {
            if (!$.data(this, 'ChartBuilderChartsJsMain')) {
                $.data(this, 'ChartBuilderChartsJsMain', new ChartBuilderChartsJs(this, options));
            } else {
                try {
                    $(this).data('ChartBuilderChartsJsMain').init();
                } catch (err) {
                    console.error('ChartBuilderChartsJsMain has not initiated properly');
                }
            }
        });
    };
    $(document).find('#ays-charts-form-chart-js').ChartBuilderChartsJsMain();

})(jQuery);

(function ($) {

	$.fn.serializeFormJSON = function () {
		let o = {},
			a = this.serializeArray();
		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	$.fn.lock = function () {
		$(this).each(function () {
			var $this = $(this);
			var position = $this.css('position');

			if (!position) {
				position = 'static';
			}

			switch (position) {
				case 'absolute':
				case 'relative':
					break;
				default:
					$this.css('position', 'relative');
					break;
			}
			$this.data('position', position);

			var width = $this.width(),
				height = $this.height();

			var locker = $('<div class="locker"></div>');
			locker.width(width).height(height);

			var loader = $('<div class="locker-loader"></div>');
			loader.width(width).height(height);

			locker.append(loader);
			$this.append(locker);
			$(window).resize(function () {
				$this.find('.locker,.locker-loader').width($this.width()).height($this.height());
			});
		});

		return $(this);
	};

	$.fn.unlock = function () {
		$(this).each(function () {
			$(this).find('.locker').remove();
			$(this).css('position', $(this).data('position'));
		});

		return $(this);
	};
})(jQuery);