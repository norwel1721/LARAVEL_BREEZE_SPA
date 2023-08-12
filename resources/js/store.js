import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)
const persistedData = new createPersistedState({
    key:'spa_training',
    storage: localStorage,
    reducer : state => ({
        loggedInUser : state.loggedInUser
    })
})

export default new Vuex.Store({
    state:{
        loggedInUser : null,
        allUsers : [],
        rules: {
            required: [(v) => !!v || "Field is required"],
            email: [
                (v) =>
                    !v ||
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid",
            ],
            password: [
                (v) => !!v || "Field is required",
                // (v) => !v || /[0-9]/.test(v) || "Must contain number",
                // (v) => !v || /[a-zA-Z]/.test(v) || "Must contain letter",
                // v => !v || /[@$!%*?&]/.test(v) || 'Must contain symbol',
                (v) =>
                    (v || "").length >= 8 ||
                    "Must contain atlest 8 characters.",
            ],
            hex: [
                (v) =>
                    !v || /[0-9A-Fa-f]{6}/.test(v) || "Must be a hex value",
            ],
            confirmpassword(temp, actual) {
                return [(v) => temp === actual || "Password must match"];
            },
            uniqueRole(list) {
                return [
                    (v) => !!v || "Field is required",
                    (v) => 
                        // console.log(typeof _.find(list, {name : v}) === 'object', list, v)
                        typeof _.find(list, {name : v}) === 'undefined' ||
                        "Role is already exists.",
                ];
            },
            uniquePermission(list) {
                return [
                    (v) => !!v || "Field is required",
                    (v) => 
                        // console.log(typeof _.find(list, {name : v}) === 'object', list, v)
                        typeof _.find(list, {name : v}) === 'undefined' ||
                        "Permission is already exists.",
                ];
            },
            array: [(v) => !v.length == 0 || "Field is required"],
            higher_number(min, max) {
                return [
                    (v) => !!v || "Field is required",
                    (v) => v > min || "Must Higher",
                    (v) => v <= max || "Too much",
                ];
            },
            numberRule: [
                (v) => {
                    if (!isNaN(v) && v >= 0 && v <= 99) return true;
                    return "Field is required";
                },
            ],
        },
    },

    actions:{
        login({commit}){
            axios({
                method : "GET",
                url : 'auth-user',
            })
            .then( response => {
                commit('login', response.data);
            } )
        },

        logout(context){
            context.commit('logout');
        }
    },

    mutations:{
        login(state, payload){
            state.loggedInUser = payload
            window.location.href='/';
        },

        logout(state){
            state.loggedInUser = {}
            state.isLoggedin = false;
        },

        getUsers(state, data){
            state.allUsers = data
        }
    },
    getters:{},
    plugins: [persistedData]
});