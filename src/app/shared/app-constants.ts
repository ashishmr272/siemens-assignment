export const AppConstants = {
    actions: new Map()
        .set('currentList', [{ label: 'Edit', field: 'edit', color: 'primary' }, { label: 'Delete', field: 'delete', color: 'warn' }])
        .set('deletedList', [{ label: 'Restore', field: 'restore', color: 'primary' }]),

    actionEvent: {
        ADD: 'add',
        EDIT: 'edit',
        DELETE: 'delete',
        RESTORE: 'restore'
    }
}