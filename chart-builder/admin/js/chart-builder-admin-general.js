(function($) {
    'use strict';

	$(document).ready(function () {
		var sourceType = 'google-charts';
		var chartType = 'pie_chart';

		$('[data-toggle="popover"]').popover();
    	$('[data-bs-toggle="tooltip"]').tooltip();
		
		/* == Add new modal configuration == */
			$(document).on('dblclick', '.ays-chart-layer_box_blocks label.ays-chart-dblclick-layer:not(.ays-chart-type-pro-feature)', function(){
				$(document).find('.ays-chart-select_button_layer input.ays-chart-layer_button').trigger('click');
			});

			$(document).on('change', '.ays-chart-choose-source', function(){
				$(document).find('.ays-chart-select_button_layer input.ays-chart-layer_button').prop('disabled',false).attr("data-type" , $(this).val());
			});

			$(document).on('change', '.ays-chart-layer_box_source_type_select' ,function(){
				var type = $(this).find('option:selected').val();

				sourceType = type ?? 'google-charts';
				$(document).find('.ays-chart-layer_box_blocks').hide();
				$(document).find('.ays-chart-layer_box_blocks[source-type="' + sourceType + '"]').show();
				
				if (sourceType === 'chart-js') {
					$(document).find('.ays-chart-layer_box_link').hide();
				} else {
					$(document).find('.ays-chart-layer_box_link').show();
				}
			});

			$(document).on('click', '.ays-chart-layer_button' ,function(){
				chartType = $(document).find('.ays-chart-choose-source:checked').val();
				
				var currentUrl = new URL(window.location.href);

				currentUrl.searchParams.set('source', sourceType);
				currentUrl.searchParams.set('type', chartType);

				window.location.href = currentUrl.toString();
			});
		/* */

		// Replace image to YouTube embed video
        $(document).on('click', '.ays-chart-youtube-placeholder', function() {
            var videoId = $(this).data('video-id');
            var iframe = $('<iframe>', {
                src: 'https://www.youtube.com/embed/' + videoId + '?autoplay=1',
                class: '',
                width: 560,
                height: 315,
                frameborder: 0,
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                allowfullscreen: true,
            });
            $(this).replaceWith(iframe);
        });

		$(document).find('#ays-title').on('input', function () {
            $(document).find('.ays_chart_title_in_top').text($(this).val());
        });
		
    	$(document).find('.form-check-input.select-all').on('click', function() {
			var checkboxes = $(document).find('.check-current-row');
			if ($(this).prop('checked') == true && checkboxes.length !== 0) {
				$(this).parents('thead').next('tbody').find('tr').addClass("ays-chart-tr-selected");
				checkboxes.prop('checked',true);
				$(document).find('#ays-chart-bulk-delete').prop('disabled', false);
				$(document).find('#ays-chart-bulk-delete-bottom').prop('disabled', false);
			} else {
				$(this).parents('thead').next('tbody').find('tr').removeClass("ays-chart-tr-selected");
				checkboxes.prop('checked',false);
				$(document).find('#ays-chart-bulk-delete').prop('disabled', true);
				$(document).find('#ays-chart-bulk-delete-bottom').prop('disabled', true);
			}
		});

		$(document).find('.check-current-row').on('click', function() {
			var checkboxesArr = $(document).find('.check-current-row');
			var selectAllCheckBox = $(document).find('.form-check-input.select-all'); 
			var count = 0;

			for (var i = 0; i < checkboxesArr.length; i++) {
				if (checkboxesArr.eq(i).prop('checked') == true) {
					count++;
				}
			}	

			if ((count == 0 && selectAllCheckBox.prop('checked') == true) || (count != 0 && selectAllCheckBox.prop('checked') == true)) {
				selectAllCheckBox.prop('checked', false);	
			} else if (count == checkboxesArr.length && selectAllCheckBox.prop('checked') == false) {
				selectAllCheckBox.prop('checked', true);
			}

			if ( $(this).prop('checked') ) {
				$(this).parents('tr').addClass("ays-chart-tr-selected");
				$(document).find('#ays-chart-bulk-delete').prop('disabled', false);
				$(document).find('#ays-chart-bulk-delete-bottom').prop('disabled', false);
			} else if ( !$(this).prop('checked') && count > 0) {
				$(this).parents('tr').removeClass("ays-chart-tr-selected");
				$(document).find('#ays-chart-bulk-delete').prop('disabled', false);
				$(document).find('#ays-chart-bulk-delete-bottom').prop('disabled', false);
			} else {
				$(this).parents('tr').removeClass("ays-chart-tr-selected");
				$(document).find('#ays-chart-bulk-delete').prop('disabled', true);
				$(document).find('#ays-chart-bulk-delete-bottom').prop('disabled', true);
			}
		});

		// Bulk delete confirmation
		$(document).on('click', '#ays-chart-bulk-delete', function(e) {
			e.preventDefault();
			var confirm = window.confirm(aysChartBuilderAdmin.confirmDelete);
			if (confirm) {
				$(document).find('#ays-chart-bulk-delete-confirm').trigger('click');
			}
		});
		$(document).on('click', '#ays-chart-bulk-delete-bottom', function(e) {
			e.preventDefault();
			var confirm = window.confirm(aysChartBuilderAdmin.confirmDelete);
			if (confirm) {
				$(document).find('#ays-chart-bulk-delete-confirm-bottom').trigger('click');
			}
		});

		// Delete confirmation
		$(document).on('click', '.ays_chart_delete_confirm', function(e){            
			e.preventDefault();
			var confirm = window.confirm(aysChartBuilderAdmin.confirmDelete);
			if (confirm){
				window.location.replace($(this).attr('href'));
			}
		});

		function performSearch() {
			var _this  = $(this);
			var parent = _this.parents('form');
			
			var search_input = parent.find('input#ays-chart-search-input');
			var input_value  = search_input.val();
			
			var field = 's';
			var flag = false;
			var url = window.location.href;
			if (url.indexOf('?' + field + '=') != -1) {
				flag = true;
			} else if (url.indexOf('&' + field + '=') != -1) {
				flag = true;
			}
			
			if (flag) {
				if (typeof input_value != 'undefined' && input_value != "") {
					url = location.href.replace(/&s=([^&]$|[^&]*)/i, "&s=" + input_value);
				} else if (input_value == "") {
					url = location.href.replace(/&s=([^&]$|[^&]*)/i, "");
				}
			} else {
				if (typeof input_value != 'undefined' && input_value != "") {
					url = location.href + "&s=" + input_value;
				}
			}
			
			location.href = url.replace(/&paged=([^&]$|[^&]*)/i, "&paged=1");
		}
	
		$(document).find("input#ays-chart-search-input + button#ays-chart-search").on("click", function (e) {
			e.preventDefault();
			performSearch.call(this);
		});
	
		$(document).on("keypress", '#ays-chart-search-input', function (e) {
			if (e.which === 13) {
				e.preventDefault();
				performSearch.call(this);
			}
		});

		$(document).on("click", "button[id^='ays-chart-filter']", function (e) {
			e.preventDefault();
			var _this = $(this);
			var parent = _this.parents('form');
			
			var inputSelectors = ['#ays-chart-filter-select', '#ays-chart-filter-author', '#ays-chart-filter-source', '#ays-chart-filter-chart-source', '#ays-chart-filter-date', '#ays-chart-order-by', '#ays-chart-order'];
			var inputValues = inputSelectors.map(selector => parent.find(selector).val());

			var filterFields = ['filterbytype', 'filterbyauthor', 'filterbysource', 'filterbychartsource', 'filterbydate', 'orderby', 'order'];

			addFiltersUrl(inputValues, filterFields);
		});

		$(document).on("click", "button[id^='ays-chart-filter-clear']", function (e) {
			e.preventDefault();
			clearFiltersUrl();
		});

		function addFiltersUrl(inputValues, filterFields) {
			var url = window.location.href;
			for (var i = 0; i < inputValues.length; i++) {
				var flag = url.includes('?' + filterFields[i] + '=') || url.includes('&' + filterFields[i] + '=');
				if (flag) {
					url = url.replace(new RegExp('&?' + filterFields[i] + '=([^&]*)'), '');
				}
				if (inputValues[i]) {
					url += '&' + filterFields[i] + '=' + inputValues[i];
				}
			}

			location.href = url.replace(/&paged=([^&]$|[^&]*)/i, "&paged=1");
		}

		function clearFiltersUrl() {
			var url = window.location.href;
			var filterFields = ['filterbytype', 'filterbyauthor', 'filterbysource', 'filterbychartsource', 'filterbydate', 'orderby', 'order'];

			for (var i = 0; i < filterFields.length; i++) {
				url = url.replace(new RegExp('&?' + filterFields[i] + '=([^&]*)'), '');
			}

			location.href = url.replace(/&paged=([^&]$|[^&]*)/i, "&paged=1");
		}

		$(document).find('#ays-chart-filter-author').select2({
			placeholder: aysChartBuilderAdmin.selectUser,
			dropdownAutoWidth: true,
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
					var checkedUsers = $(document).find('#ays-chart-filter-author').val();
					return {
						action: 'ays_chart_admin_ajax',
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
		$(document).find('#ays-chart-filter-author-bottom').select2({
			placeholder: aysChartBuilderAdmin.selectUser,
			dropdownAutoWidth: true,
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
					var checkedUsers = $(document).find('#ays-chart-filter-author-bottom').val();
					return {
						action: 'ays_chart_admin_ajax',
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

		$(document).on('mouseenter', 'td.column-title', function() {
			// $(this).find('.chart-list-table-actions-row').css('visibility', 'visible');
			$(this).find('.chart-list-table-actions-row').css('display', 'flex');
			// $(this).css('padding', '8px 8px');
		});
		$(document).on('mouseleave', 'td.column-title', function() {
			// $(this).find('.chart-list-table-actions-row').css('visibility', 'hidden');
			$(this).find('.chart-list-table-actions-row').hide();
			// $(this).css('padding', '23px 8px');
		});

		$(document).find('.ays-chart-copy-image').on('click', function(){
			var _this = this;
			var input = $(_this).parent().find('input.ays-chart-shortcode-input');
			var length = input.val().length;

			input[0].focus();
			input[0].setSelectionRange(0, length);
			document.execCommand('copy');
			// document.getSelection().removeAllRanges();

			$(_this).attr('data-original-title', aysChartBuilderAdmin.copied);
			$(_this).attr("data-bs-original-title", aysChartBuilderAdmin.copied);
			$(_this).attr("title", aysChartBuilderAdmin.copied);
			$(_this).tooltip('show');
		});
		
		$(document).find('.ays-chart-shortcode-input').on('focus', function(){
			this.setSelectionRange(0, $(this).val().length);
		});

		$(document).find('.ays-chart-copy-image').on('mouseleave', function(){
			var _this = this;

			$(_this).attr('data-original-title', aysChartBuilderAdmin.clickForCopy);
			$(_this).attr("data-bs-original-title", aysChartBuilderAdmin.clickForCopy);
			$(_this).attr("title", aysChartBuilderAdmin.clickForCopy);
		});

		$(document).on('click', '.notice-dismiss', function (e) {
			changeCurrentUrl('status');
		});

		var toggle_ddmenu = $(document).find('.toggle_ddmenu');
    	toggle_ddmenu.on('click', function () {
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
    	});

		function changeCurrentUrl(key){
			var linkModified = location.href.split('?')[1].split('&');
			for(var i = 0; i < linkModified.length; i++){
				if(linkModified[i].split("=")[0] == key){
					linkModified.splice(i, 1);
				}
			}
			linkModified = linkModified.join('&');
			window.history.replaceState({}, document.title, '?'+linkModified);
		}

		// Select message vars charts page
        $(document).find('.ays-chart-message-vars-icon').on('click', function(e){
            $(this).parents(".ays-chart-message-vars-box").find(".ays-chart-message-vars-data").toggle('fast');
        });

        $(document).find('.ays-chart-open-charts-list').on('click', function(e){
            $(this).parents(".ays-chart-subtitle-main-box").find(".ays-chart-charts-data").toggle('fast');
        });
        
        $(document).on( "click" , function(e){
            if($(e.target).closest('.ays-chart-message-vars-box,.ays-chart-subtitle-main-box').length != 0){
                
            } 
            else{
                $(document).find(".ays-chart-message-vars-box .ays-chart-message-vars-data,.ays-chart-subtitle-main-box .ays-chart-charts-data").hide('fast');
            }
        });

        $(document).find(".ays-chart-go-to-charts").on("click" , function(e){
            e.preventDefault();
            var confirmRedirect = window.confirm('Are you sure you want to redirect to another chart? Note that the changes made in this chart will not be saved.');
            if(confirmRedirect){
                window.location = $(this).attr("href");
            }
        });

        $(document).find('.ays-chart-message-vars-each-data').on('click', function(e){
            var messageVar = $(this).find(".ays-chart-message-vars-each-var").val();
            var mainParent = $(this).parents('.ays-chart-box-for-mv');
            var dataTMCE   = mainParent.find('.ays-chart-message-vars-data').attr('data-tmce');
            
            if ( mainParent.find("#wp-"+dataTMCE+"-wrap").hasClass("tmce-active") ){
                window.tinyMCE.get(dataTMCE).setContent( window.tinyMCE.get(dataTMCE).getContent() + messageVar + " " );
            }else{
                mainParent.find('#'+dataTMCE).append( " " + messageVar + " ");
            }
        });

		$(document).on("click", ".ays-chart-cards-block .ays-chart-card__footer button.status-missing", function(e){
			var $this = $(this);
			var thisParent = $this.parents(".ays-chart-cards-block");
	
			$this.prop('disabled', true);
			$this.addClass('disabled');
	
			var loader_html = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
	
			$this.html(loader_html);
	
			var attr_plugin = $this.attr('data-plugin');
			var wp_nonce = thisParent.find('#ays_chart_ajax_install_plugin_nonce').val();
	
			var data = {
				action: 'ays_chart_install_plugin',
				_ajax_nonce: wp_nonce,
				plugin: attr_plugin,
				type: 'plugin'
			};
	
			$.ajax({
				url: aysChartBuilderAdmin.ajaxUrl,
				method: 'post',
				dataType: 'json',
				data: data,
				success: function (response) {
					if (response.success) {
						swal.fire({
							type: 'success',
							html: "<h4>"+ response['data']['msg'] +"</h4>"
						}).then( function(res) {
							if ( $this.hasClass('status-missing') ) {
								$this.removeClass('status-missing');
							}
							$this.text(aysChartBuilderAdmin.activated);
							$this.addClass('status-active');
						});
					}
					else {
						swal.fire({
							type: 'info',
							html: "<h4>"+ response['data'][0]['message'] +"</h4>"
						}).then( function(res) {
							$this.text(aysChartBuilderAdmin.errorMsg);
						});
					}
				},
				error: function(){
					swal.fire({
						type: 'info',
						html: "<h2>"+ aysChartBuilderAdmin.loadResource +"</h2><br><h6>"+ aysChartBuilderAdmin.somethingWentWrong +"</h6>"
					}).then( function(res) {
						$this.text(aysChartBuilderAdmin.errorMsg);
					});
					// $this.prop('disabled', false);
					// if ( $this.hasClass('disabled') ) {
					//     $this.removeClass('disabled');
					// }
				}
			});
		});
	
		$(document).on("click", ".ays-chart-cards-block .ays-chart-card__footer button.status-installed", function(e){
			var $this = $(this);
			var thisParent = $this.parents(".ays-chart-cards-block");
	
			$this.prop('disabled', true);
			$this.addClass('disabled');
	
			var loader_html = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
	
			$this.html(loader_html);
	
			var attr_plugin = $this.attr('data-plugin');
			var wp_nonce = thisParent.find('#ays_chart_ajax_install_plugin_nonce').val();
	
			var data = {
				action: 'ays_chart_activate_plugin',
				_ajax_nonce: wp_nonce,
				plugin: attr_plugin,
				type: 'plugin'
			};
	
			$.ajax({
				url: aysChartBuilderAdmin.ajaxUrl,
				method: 'post',
				dataType: 'json',
				data: data,
				success: function (response) {
					if( response.success ){
						swal.fire({
							type: 'success',
							html: "<h4>"+ response['data'] +"</h4>"
						}).then( function(res) {
							if ( $this.hasClass('status-installed') ) {
								$this.removeClass('status-installed');
							}
							$this.text(aysChartBuilderAdmin.activated);
							$this.addClass('status-active disabled');
						});
					} else {
						swal.fire({
							type: 'info',
							html: "<h4>"+ response['data'][0]['message'] +"</h4>"
						});
					}
				},
				error: function(){
					swal.fire({
						type: 'info',
						html: "<h2>"+ aysChartBuilderAdmin.loadResource +"</h2><br><h6>"+ aysChartBuilderAdmin.somethingWentWrong +"</h6>"
					}).then( function(res) {
						$this.text(aysChartBuilderAdmin.errorMsg);
					});;
					// $this.prop('disabled', false);
					// if ( $this.hasClass('disabled') ) {
					//     $this.removeClass('disabled');
					// }
				}
			});
		});

		$(document).on("click", "#ays-chart-dismiss-buttons-content .ays-button, #ays-chart-dismiss-buttons-content-helloween .ays-button-helloween, #ays-chart-dismiss-buttons-content-black-friday .ays-button-black-friday", function(e){
			e.preventDefault();
	
			var $this = $(this);
			var thisParent  = $this.parents("#ays-chart-dismiss-buttons-content");
			// var thisParent  = $this.parents("#ays-chart-dismiss-buttons-content-helloween");
			// var thisParent  = $this.parents("#ays-chart-dismiss-buttons-content-black-friday");
			var mainParent  = $this.parents("div.ays_chart_dicount_info");
			var closeButton = mainParent.find("button.notice-dismiss");
	
			var attr_plugin = $this.attr('data-plugin');
			var wp_nonce    = thisParent.find('#chart-builder-sale-banner').val();
			if(typeof wp_nonce == 'undefined'){
				wp_nonce    = $(document).find('#chart-builder-sale-banner').val();
			}

			var data = {
				action: 'ays_chart_dismiss_button',
				_ajax_nonce: wp_nonce,
			};
	
			$.ajax({
				url: aysChartBuilderAdmin.ajaxUrl,
				method: 'post',
				dataType: 'json',
				data: data,
				success: function (response) {
					if( response.status ){
						closeButton.trigger('click');
					} else {
						swal.fire({
							type: 'info',
							html: "<h2>"+ aysChartBuilderAdmin.errorMsg +"</h2><br><h6>"+ aysChartBuilderAdmin.somethingWentWrong +"</h6>"
						}).then(function(res) {
							closeButton.trigger('click');
						});
					}
				},
				error: function(){
					swal.fire({
						type: 'info',
						html: "<h2>"+ aysChartBuilderAdmin.errorMsg +"</h2><br><h6>"+ aysChartBuilderAdmin.somethingWentWrong +"</h6>"
					}).then(function(res) {
						closeButton.trigger('click');
					});
				}
			});
		});

        /* */

		// Pro features start
		$(document).find(".ays-pro-features-v2-upgrade-button").hover(function() {
			// Code to execute when the mouse enters the element
			var unlockedImg = "Unlocked_24_24.svg";
			var imgBox = $(this).find(".ays-pro-features-v2-upgrade-icon");
			var imgUrl = imgBox.attr("data-img-src");
			var newString = imgUrl.replace("Locked_24x24.svg", unlockedImg);
			
			imgBox.css("background-image", 'url(' + newString + ')');
			imgBox.attr("data-img-src", newString);
		}, function() {
			
			var lockedImg = "Locked_24x24.svg";
			var imgBox = $(this).find(".ays-pro-features-v2-upgrade-icon");
			var imgUrl = imgBox.attr("data-img-src");
			var newString = imgUrl.replace("Unlocked_24_24.svg", lockedImg);
			
			imgBox.css("background-image", 'url(' + newString + ')');
			imgBox.attr("data-img-src", newString);
		});
		// Pro features end

		var checkCountdownIsExists = $(document).find('#ays-chart-countdown-main-container');

		if ( checkCountdownIsExists.length > 0 ) {
            var second  = 1000,
                minute  = second * 60,
                hour    = minute * 60,
                day     = hour * 24;

			var chartCountdownEndTime = aysChartBuilderAdmin.chartBannerDate;
			// var chartCountdownEndTime = "JAN 15, 2025 23:59:59";
			var countDown_new = new Date(chartCountdownEndTime).getTime();

            if ( isNaN(countDown_new) || isFinite(countDown_new) == false ) {
                var AYS_QUIZ_MILLISECONDS = 3 * day;
                var countdownStartDate = new Date(Date.now() + AYS_QUIZ_MILLISECONDS);
                var quizCountdownEndTime = countdownStartDate.aysQuizCustomFormat( "#YYYY#-#MM#-#DD# #hhhh#:#mm#:#ss#" );
                var countDown_new = new Date(quizCountdownEndTime).getTime();
            }

            aysChartBannerCountdown();

            var y = setInterval(function() {

                var now = new Date().getTime();
                var distance_new = countDown_new - now;

                aysChartBannerCountdown();

                if (distance_new < 0) {
                    var headline  = document.getElementById("ays-chart-countdown-headline"),
                        countdown = document.getElementById("ays-chart-countdown"),
                        content   = document.getElementById("ays-chart-countdown-content");

                  // headline.innerText = "Sale is over!";
                  countdown.style.display = "none";
                  content.style.display = "block";

                  clearInterval(y);
                }
            }, 1000);
        }

		function aysChartBannerCountdown(){
            var now = new Date().getTime();
            var distance_new = countDown_new - now;

            var countDownDays    = document.getElementById("ays-chart-countdown-days");
			var countDownHours   = document.getElementById("ays-chart-countdown-hours");
			var countDownMinutes = document.getElementById("ays-chart-countdown-minutes");
			var countDownSeconds = document.getElementById("ays-chart-countdown-seconds");

            if((countDownDays !== null || countDownHours !== null || countDownMinutes !== null || countDownSeconds !== null) && distance_new > 0){

                var countDownDays_innerText    = Math.floor(distance_new / (day));
                var countDownHours_innerText   = Math.floor((distance_new % (day)) / (hour));
                var countDownMinutes_innerText = Math.floor((distance_new % (hour)) / (minute));
                var countDownSeconds_innerText = Math.floor((distance_new % (minute)) / second);

                if( isNaN(countDownDays_innerText) || isNaN(countDownHours_innerText) || isNaN(countDownMinutes_innerText) || isNaN(countDownSeconds_innerText) ){
					var headline  = document.getElementById("ays-chart-countdown-headline"),
						countdown = document.getElementById("ays-chart-countdown"),
						content   = document.getElementById("ays-chart-countdown-content");

					// headline.innerText = "Sale is over!";
					countdown.style.display = "none";
					content.style.display = "block";

					clearInterval(y);
				} else {
                    countDownDays.innerText    = countDownDays_innerText;
                    countDownHours.innerText   = countDownHours_innerText;
                    countDownMinutes.innerText = countDownMinutes_innerText;
                    countDownSeconds.innerText = countDownSeconds_innerText;
                }
			}
        }

		Date.prototype.aysChartCustomFormat = function( formatString){
			var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
			YY = ((YYYY=this.getFullYear())+"").slice(-2);
			MM = (M=this.getMonth()+1)<10?('0'+M):M;
			MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
			DD = (D=this.getDate())<10?('0'+D):D;
			DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
			th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
			formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
			h=(hhh=this.getHours());
			if (h==0) h=24;
			if (h>12) h-=12;
			hh = h<10?('0'+h):h;
			hhhh = hhh<10?('0'+hhh):hhh;
			AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
			mm=(m=this.getMinutes())<10?('0'+m):m;
			ss=(s=this.getSeconds())<10?('0'+s):s;
	
			return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
			// token:     description:             example:
			// #YYYY#     4-digit year             1999
			// #YY#       2-digit year             99
			// #MMMM#     full month name          February
			// #MMM#      3-letter month name      Feb
			// #MM#       2-digit month number     02
			// #M#        month number             2
			// #DDDD#     full weekday name        Wednesday
			// #DDD#      3-letter weekday name    Wed
			// #DD#       2-digit day number       09
			// #D#        day number               9
			// #th#       day ordinal suffix       nd
			// #hhhh#     2-digit 24-based hour    17
			// #hhh#      military/24-based hour   17
			// #hh#       2-digit hour             05
			// #h#        hour                     5
			// #mm#       2-digit minute           07
			// #m#        minute                   7
			// #ss#       2-digit second           09
			// #s#        second                   9
			// #ampm#     "am" or "pm"             pm
			// #AMPM#     "AM" or "PM"             PM
		};

		var createdNewChart = getCookie('ays_chart_created_new');
        if (createdNewChart && createdNewChart > 1) {
			var url = new URL(window.location.href);
			var getCustomPostId = getCookie('ays_chart_created_new_'+createdNewChart+'_post_id');
            var link = "#";
            if(getCustomPostId){
                link = getCustomPostId;
            }

            var parameterValue = url.searchParams.get("action");
            var htmlDefaultText = '<p style="margin-top:1rem;">For more detailed configuration visit <a href="admin.php?page=chart-builder&action=edit&id=' + createdNewChart + '">edit chart page</a>.</p>';

			var htmlContent = parameterValue && parameterValue == 'edit' ? '' : htmlDefaultText;
			var previewButtonSvgIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9999 7.21325C11.8231 7.21325 11.6535 7.28349 11.5285 7.40851C11.4035 7.53354 11.3333 7.70311 11.3333 7.87992V12.6666C11.3333 12.8434 11.263 13.013 11.138 13.138C11.013 13.263 10.8434 13.3333 10.6666 13.3333H3.33325C3.15644 13.3333 2.98687 13.263 2.86185 13.138C2.73682 13.013 2.66659 12.8434 2.66659 12.6666V5.33325C2.66659 5.15644 2.73682 4.98687 2.86185 4.86185C2.98687 4.73682 3.15644 4.66658 3.33325 4.66658H8.11992C8.29673 4.66658 8.4663 4.59635 8.59132 4.47132C8.71635 4.3463 8.78658 4.17673 8.78658 3.99992C8.78658 3.82311 8.71635 3.65354 8.59132 3.52851C8.4663 3.40349 8.29673 3.33325 8.11992 3.33325H3.33325C2.80282 3.33325 2.29411 3.54397 1.91904 3.91904C1.54397 4.29411 1.33325 4.80282 1.33325 5.33325V12.6666C1.33325 13.197 1.54397 13.7057 1.91904 14.0808C2.29411 14.4559 2.80282 14.6666 3.33325 14.6666H10.6666C11.197 14.6666 11.7057 14.4559 12.0808 14.0808C12.4559 13.7057 12.6666 13.197 12.6666 12.6666V7.87992C12.6666 7.70311 12.5963 7.53354 12.4713 7.40851C12.3463 7.28349 12.1767 7.21325 11.9999 7.21325ZM14.6133 1.74659C14.5456 1.58369 14.4162 1.45424 14.2533 1.38659C14.1731 1.35242 14.087 1.33431 13.9999 1.33325H9.99992C9.82311 1.33325 9.65354 1.40349 9.52851 1.52851C9.40349 1.65354 9.33325 1.82311 9.33325 1.99992C9.33325 2.17673 9.40349 2.3463 9.52851 2.47132C9.65354 2.59635 9.82311 2.66659 9.99992 2.66659H12.3933L5.52659 9.52658C5.4641 9.58856 5.4145 9.66229 5.38066 9.74353C5.34681 9.82477 5.32939 9.91191 5.32939 9.99992C5.32939 10.0879 5.34681 10.1751 5.38066 10.2563C5.4145 10.3375 5.4641 10.4113 5.52659 10.4733C5.58856 10.5357 5.66229 10.5853 5.74353 10.6192C5.82477 10.653 5.91191 10.6705 5.99992 10.6705C6.08793 10.6705 6.17506 10.653 6.2563 10.6192C6.33754 10.5853 6.41128 10.5357 6.47325 10.4733L13.3333 3.60659V5.99992C13.3333 6.17673 13.4035 6.3463 13.5285 6.47132C13.6535 6.59635 13.8231 6.66658 13.9999 6.66658C14.1767 6.66658 14.3463 6.59635 14.4713 6.47132C14.5963 6.3463 14.6666 6.17673 14.6666 5.99992V1.99992C14.6655 1.9128 14.6474 1.82673 14.6133 1.74659Z" fill="#007DCB"/></svg>';
			
            swal({
                title: '<strong>Great job</strong>',
                type: 'success',
                html: '<p>Your chart is Created!<br>Copy the generated shortcode and paste it into any post or page to display the chart.</p><input type="text" id="ays-chart-create-new" onClick="this.setSelectionRange(0, this.value.length)" readonly value="[ays_chart id=\'' + createdNewChart + '\']" />' + htmlContent,
                confirmButtonText: '<a href="'+ link +'" target="_blank">'+ 'Preview Chart' + ' ' + previewButtonSvgIcon +'</a>',
                confirmButtonAriaLabel: 'Preview this chart',
				showCloseButton: true,
                focusConfirm: false,
                cancelButtonText: '<i class="ays_fa ays_fa_thumbs_up"></i> Done',
                cancelButtonAriaLabel: 'Thumbs up, done!',
			});
			deleteCookie('ays_chart_created_new');
			deleteCookie('ays_chart_created_new'+createdNewChart+'_post_id');
        }
		
		function getCookie (cname) {
			let name = cname + "=";
			let decodedCookie = decodeURIComponent(document.cookie);
			let ca = decodedCookie.split(';');
			for(let i = 0; i <ca.length; i++) {
			  let c = ca[i];
			  while (c.charAt(0) == ' ') {
				c = c.substring(1);
			  }
			  if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			  }
			}
			return "";
		}
	
		function deleteCookie (name) {
			document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		}

	});

})(jQuery);

function selectAndCopyElementContents(el) {
    if (window.getSelection && document.createRange) {
        var _this = jQuery(document).find('.ays-chart-copy-element-box');

        var text      = el.textContent;
        var textField = document.createElement('textarea');

        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();

        var selection = window.getSelection();
        selection.setBaseAndExtent(el,0,el,1);

        _this.attr( "data-original-title", 'Copied!' );
        _this.attr( "title", 'Copied!' );

        _this.tooltip("show");

    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}