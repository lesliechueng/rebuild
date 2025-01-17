/*!
Copyright (c) REBUILD <https://getrebuild.com/> and/or its owners. All rights reserved.

rebuild is dual-licensed under commercial and open source licenses (GPLv3).
See LICENSE and COMMERCIAL in the project root for license information.
*/

// eslint-disable-next-line no-undef, no-unused-vars
window.clickIcon = function (icon) {
  $('#entityIcon').attr('value', icon).find('i').attr('class', `icon zmdi zmdi-${icon}`)
  RbModal.hide()
}

const wpc = window.__PageConfig

$(document).ready(() => {
  if (!wpc.metaId) $('.footer .alert').removeClass('hide')
  else $('.footer .J_action').removeClass('hide')

  $(`.nav-tabs>li[data-name=${wpc.entity}]>a`).addClass('active')
  if ($('.J_details')[0]) {
    const $toggle = $('.J_for-details')
    $('<i class="icon zmdi zmdi-caret-down ml-1 mr-0 text-muted fs-18"></i>').appendTo($toggle)
    $toggle.attr('data-toggle', 'dropdown')
    $toggle.next().find(`a[data-name=${wpc.entity}]`).addClass('text-primary')
  }

  const $btn = $('.J_save').on('click', () => {
    if (!wpc.metaId) return

    let data = {
      entityLabel: $val('#entityLabel'),
      nameField: $val('#nameField'),
      comments: $val('#comments'),
    }
    if (data.entityLabel === '') return RbHighbar.create($L('请输入实体名称'))

    const icon = $val('#entityIcon')
    if (icon) data.icon = icon

    let extConfig = {
      quickFields: $('#quickFields').val().join(','),
      tags: $('#tags').val().join(','),
    }
    // v3.1
    if ($('#detailsNotEmpty')[0]) {
      extConfig.detailsNotEmpty = $val('#detailsNotEmpty')
      // v3.4
      extConfig.detailsGlobalRepeat = $val('#detailsGlobalRepeat')
    }
    // v3.4
    if ($('#repeatFieldsCheckMode')[0]) {
      extConfig.repeatFieldsCheckMode = $val('#repeatFieldsCheckMode') ? 'and' : 'or'
      extConfig.disabledViewEditable = $val('#disabledViewEditable')
    }

    extConfig = wpc.extConfig ? { ...wpc.extConfig, ...extConfig } : extConfig
    if (!$same(extConfig, wpc.extConfig)) data.extConfig = extConfig

    data = $cleanMap(data)
    if (Object.keys(data).length === 0) {
      location.reload()
      return
    }

    data.metadata = {
      entity: 'MetaEntity',
      id: wpc.metaId,
    }

    $btn.button('loading')
    $.post('../entity-update', JSON.stringify(data), (res) => {
      if (res.error_code === 0) location.reload()
      else RbHighbar.error(res.error_msg)
    })
  })

  $('#entityIcon').on('click', () => RbModal.create('/p/common/search-icon', $L('选择图标')))

  // 排序
  function sortFields(fields) {
    const ss = []
    fields.forEach((item) => {
      if (item.disabled === false) ss.push(item)
    })
    // fields.forEach((item) => {
    //   if (item.disabled === true) ss.push(item)
    // })
    return ss
  }

  const SYS_FIELDS = ['approvalId', 'approvalLastUser']
  const CAN_NAME = ['TEXT', 'EMAIL', 'URL', 'PHONE', 'SERIES', 'LOCATION', 'PICKLIST', 'CLASSIFICATION', 'DATE', 'DATETIME', 'TIME', 'REFERENCE']
  const CAN_QUICK = ['TEXT', 'EMAIL', 'URL', 'PHONE', 'SERIES', 'LOCATION', 'PICKLIST', 'CLASSIFICATION', 'REFERENCE']

  $.get(`/commons/metadata/fields?deep=1&entity=${wpc.entity}`, function (d) {
    // 名称字段
    const canNameFields = d.data.map((item) => {
      let canName = CAN_NAME.includes(item.type) && !SYS_FIELDS.includes(item.name)
      if (canName && item.type === 'REFERENCE') canName = item.ref[0] !== wpc.entity

      return {
        id: item.name,
        text: item.label,
        disabled: canName === false,
        title: canName === false ? $L('字段 (类型) 不适用') : item.label,
      }
    })

    $('#nameField')
      .select2({
        placeholder: $L('选择字段'),
        allowClear: false,
        data: sortFields(canNameFields),
      })
      .val(wpc.nameField || null)
      .trigger('change')

    // 快速查询
    const canQuickFields = d.data.map((item) => {
      let canQuick = CAN_QUICK.includes(item.type)
      if (canQuick && item.type === 'REFERENCE') canQuick = item.ref[0] !== wpc.entity

      return {
        id: item.name,
        text: item.label,
        disabled: canQuick === false,
        title: canQuick === false ? $L('字段 (类型) 不适用') : item.label,
      }
    })

    $('#quickFields').select2({
      placeholder: $L('默认'),
      allowClear: true,
      data: sortFields(canQuickFields),
      multiple: true,
      maximumSelectionLength: 9,
    })

    if (wpc.extConfig.quickFields) {
      $('#quickFields').val(wpc.extConfig.quickFields.split(',')).trigger('change')
    }
  })

  $.get('/admin/entity/entity-tags', (res) => {
    let data = res.data || []
    data = data.sort().map((item) => {
      return { id: item, text: item }
    })

    $('#tags').select2({
      placeholder: $L('无'),
      data: data,
      multiple: true,
      maximumSelectionLength: 5,
      language: {
        noResults: function () {
          return $L('输入标签')
        },
      },
      tags: true,
      theme: 'default select2-tag',
    })

    if (wpc.extConfig.tags) {
      $('#tags').val(wpc.extConfig.tags.split(',')).trigger('change')
    }

    $('.J_more-options-btn').on('click', () => {
      // $('.J_more-options-btn i.mdi').toggleClass('mdi-chevron-double-up')
      $('.J_more-options-btn').addClass('hide')
      $('.J_more-options').toggleClass('hide')
    })
  })

  // v3.1
  if (wpc.extConfig.detailsNotEmpty) $('#detailsNotEmpty').attr('checked', true)
  // v3.4
  if (wpc.extConfig.detailsGlobalRepeat) $('#detailsGlobalRepeat').attr('checked', true)
  if (wpc.extConfig.repeatFieldsCheckMode === 'and') $('#repeatFieldsCheckMode').attr('checked', true)
  if (wpc.extConfig.disabledViewEditable) $('#disabledViewEditable').attr('checked', true)
})
