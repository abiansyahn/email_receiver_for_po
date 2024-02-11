class ListViewOverride extends frappe.views.ListView {
	get_meta_html(doc) {
		let html = "";

		let settings_button = null;
		if (this.settings.button && this.settings.button.show(doc)) {
			settings_button = `
				<span class="list-actions">
					<button class="btn btn-action btn-default btn-xs"
						data-name="${doc.name}" data-idx="${doc._idx}"
						title="${this.settings.button.get_description(doc)}">
						${this.settings.button.get_label(doc)}
					</button>
				</span>
			`;
		}

		const modified = comment_when(doc.modified, true);

		let assigned_to = ``;

		let assigned_users = JSON.parse(doc._assign || "[]");
		if (assigned_users.length) {
			assigned_to = `<div class="list-assignments d-flex align-items-center">
					${frappe.avatar_group(assigned_users, 3, { filterable: true })[0].outerHTML}
				</div>`;
		}

		let comment_count = null;
		if (this.list_view_settings && !this.list_view_settings.disable_comment_count) {
			comment_count = $(`<span class="comment-count d-flex align-items-center"></span>`);
			$(comment_count).append(`
				${frappe.utils.icon("es-line-chat-alt")}
				${doc._comment_count > 99 ? "99+" : doc._comment_count || 0}`);
		}

		if (this.list_view_settings.name !== "Purchase Order") {
			html += `
				<div class="level-item list-row-activity hidden-xs">
					<div class="hidden-md hidden-xs">
						${settings_button || assigned_to}
					</div>
					<span class="modified">${modified}</span>
					${comment_count ? $(comment_count).prop("outerHTML") : ""}
					${comment_count ? '<span class="mx-2">·</span>' : ""}
					<span class="list-row-like hidden-xs style="margin-bottom: 1px;">
						${this.get_like_html(doc)}
					</span>
				</div>
				<div class="level-item visible-xs text-right">
					${this.get_indicator_html(doc)}
				</div>
			`;
		} else {
			if (doc.custom_unseen_incoming_email) {
				html += `
					<div class="level-item list-row-activity hidden-xs">
						<div class="hidden-md hidden-xs">
							${settings_button || assigned_to}
						</div>
						<i class="fa fa-envelope" style="color:red;"></i>
						<span class="mx-2">·</span>
						<span class="modified">${modified}</span>
						${comment_count ? $(comment_count).prop("outerHTML") : ""}
						${comment_count ? '<span class="mx-2">·</span>' : ""}
						<span class="list-row-like hidden-xs style="margin-bottom: 1px;">
							${this.get_like_html(doc)}
						</span>
					</div>
					<div class="level-item visible-xs text-right">
						${this.get_indicator_html(doc)}
					</div>
				`;
			} else {
				html += `
					<div class="level-item list-row-activity hidden-xs">
						<div class="hidden-md hidden-xs">
							${settings_button || assigned_to}
						</div>
						<span class="modified">${modified}</span>
						${comment_count ? $(comment_count).prop("outerHTML") : ""}
						${comment_count ? '<span class="mx-2">·</span>' : ""}
						<span class="list-row-like hidden-xs style="margin-bottom: 1px;">
							${this.get_like_html(doc)}
						</span>
					</div>
					<div class="level-item visible-xs text-right">
						${this.get_indicator_html(doc)}
					</div>
				`;
			}
		}
		return html;
	}
};

frappe.views.ListView = ListViewOverride;