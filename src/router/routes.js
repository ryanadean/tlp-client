import VueRouter from 'vue-router'
import FightList from '../components/FightList'
import FightDetails from '../components/FightDetails'
import Settings from '../components/Settings'


const routes = [
    { path: '/fight/:id', component: FightDetails},
    { path: '/', component: FightList},
    { path: '/settings', component: Settings},
]

const router = new VueRouter({ routes })

export default router

