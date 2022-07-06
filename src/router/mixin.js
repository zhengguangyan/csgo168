export default [
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/Test/index.vue')
    },
    {	//
        path: '/room',
        name: 'room',
        component: () => import('@/views/Roll/room.vue')
    },
    {
        path: '/Lucky_open',
        name: 'Lucky_open',
        component: () => import('@/views/Lucky/Lucky_open.vue')
    },
    {
        path: '/Compose',
        name: 'compose-index',
        component: () => import('@/views/Compose/index.vue')
    },
]