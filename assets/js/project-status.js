var projectStatus = {
	
	version: 0.1,
	projectData: null,

	container: null,

	init: function() {

		var self = this;

		container = jQuery('#project-status', 'body');

		jQuery.ajax('project.json', {
			cache: false,
			dataType: 'json',
			error: function(data, status, error) {
				console.log(data);
				console.log(status);
				console.log(error);
			},
			success: function(data) {
				self.setInfos(data);
				self.parsePages();
			}
		});
	},

	parsePages: function () {
		
		if(typeof this.projectData.pages == 'undefined' || this.projectData.pages.length <= 0) {
			return false;
		}

		var defaultPage = {
			name: "",
			file: "",
			priority: "Medium Priority",
			status: "In progress",
			icon: "none"
		}

		var templateTabDiv = '<div class="tab-pane">';
		var templateTable = '<table class="table table-striped"><thead><tr>'
		                        + '<th>Page</th>'
		                        + '<th>Status</th>'
		                        + '</tr></thead><tbody></tbody></table>';
		var templateRow = '<tr> <td><a href="%url%" %window%>%title%</a></td> <td class="status"><i class="icon-%icon%"></i> %status%</td></tr>';

		var row = null;
		var currentPage = null;
		var prio = null;
		var table = null;
		var url = null;
		var navigation = jQuery('.nav', this.container);

		for( var i in this.projectData.pages ) {

			currentPage = jQuery.extend({}, defaultPage, this.projectData.pages[i]);

			// Check tabs
			prio = this.encode(currentPage.priority);

			if(jQuery('li a[href="#'+prio+'"]', navigation).length <= 0) {
				navigation.append('<li><a href="#'+prio+'" data-toggle="tab">'+currentPage.priority+'</a></li>');
			}

			// Add template to container
			if(jQuery('.pages #'+prio, this.container).length <= 0) {
				jQuery('.pages', this.container).append(jQuery(templateTabDiv).attr('id', prio).html(templateTable));
			}

			// Add page to list
			this.container = jQuery('#project-status', 'body');
			table = jQuery('#'+prio + ' tbody', this.container);
			row = templateRow.replace('%title%', currentPage.name)
					.replace('%status%', currentPage.status)
					.replace('%icon%', currentPage.icon);

			if(this.projectData.pagesInNewWindow) {
				row = row.replace('%window%', 'target="_blank"');
			}
			else {
				row = row.replace('%window%', '');
			}

			url = this.projectData.projectPath + currentPage.file;
			row = row.replace('%url%', url);

			table.append(row)
			console.log(table);

		}

		// Activate first tab
		var navigationItems = navigation.children()
		navigationItems.first().addClass('active');
		jQuery('.pages .tab-pane', this.container).first().addClass('active');
	},

	setInfos: function(data) {

		this.projectData = data;
		var notes = jQuery('.notes', this.container);

		if(data.projectName.length > 0) {
			jQuery('title').html(data.projectName + ' - project-status');
			jQuery('.navbar .brand').html(data.projectName + ' - project-status');
		}

		if(typeof data.notes != 'undefined' && data.notes.length > 0) {
			jQuery('.note', notes).html(data.notes);
		}
		else {
			notes.hide();
		}
	},

	encode: function(phrase) {

		phrase = phrase.toLowerCase();
		phrase = phrase.replace(' ', '-');

		return phrase;
	}
}

jQuery(document).ready(function() {
	projectStatus.init();
});