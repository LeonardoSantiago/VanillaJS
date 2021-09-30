
  let allUser = [];
  let removedUsers = [];
  let attendedUsers = [];
  let selectedList = ''
  let isShowNavbar = true
  let titleUserInfo = 'Hi, My name is'
  let subtitleUserInfo = ''

  let removeTableButton = document.getElementById("remove-button")
  let allTableButton = document.getElementById("all-button")
  let attendedButton = document.getElementById("attended-button")
  let barsButton = document.getElementById("mob-navbar")

  const allEmptyMessage = "Não existem usuários nesta lista"
  const removeEmptyMessage= "Não existem usuários removidos"
  const attendedEmptyMessage = "Não existem usuários atendidos"
  const searchEmptyMessage = "Não existem usuários com este nome"

  allTableButton.classList.add('selected')

  function renderShowUser(user) {
    document.body.innerHTML = `
      <div class="page-profile">
        <div class="header-profile">
          <div id="back" class="button-back"> 
            <i class="fas fa-angle-left"></i>
          </div>
        </div>
        <div class="container-profile">
          <div class="gray-content">
          </div>
          <div class="profile-img">
            <img src="${user.picture.large}"/>
            <div class="user-container">
              <div class="user-info">
                <span id="title"> ${titleUserInfo} </span>
                <span id="subtitle"> ${subtitleUserInfo || user.name.first} </span>
              </div>
              <div class="info-icons">
                  <i id="name" class="far fa-user"></i>
                  <i id="email" class="far fa-envelope"></i>
                  <i id="birthdate" class="far fa-calendar-alt"></i>
                  <i id="location" class="fas fa-map-marker-alt"></i>
                  <i id="phone" class="fas fa-phone-alt"></i>
                  <i id="key" class="fas fa-key"></i>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    `
    addEventInInfoIcons(user)
  }

  const addEventInInfoIcons = (user) => {
    [...document.getElementsByClassName("info-icons")[0].children].map((icon) => {
      icon.addEventListener('mouseenter', (event) => {
          event.stopPropagation()
          const targetId = event.target.id
          renderSubtitle(targetId, user)
      })
    })

    document.getElementById('back').addEventListener('click', () => {
      document.location = './index.html'    
    })
  }

  function renderSubtitle(id, user) {
    switch (id) {
      case 'name': injectNewSubtitle('Hi, My name is', user.name.first)
        break;
      case 'email': injectNewSubtitle('My email address is', user.email)
        break;
      case 'birthdate': injectNewSubtitle('My birthdate is', user.dob.date)
        break;
      case 'location': injectNewSubtitle('My address is', `${user.location.street.name} - ${user.location.street.number}`)
        break;
      case 'phone': injectNewSubtitle('My number phone is', user.phone)
        break;
      case 'key': injectNewSubtitle('My password is', user.login.password)
        break;
    }
  }

  function injectNewSubtitle(title, subtitle) {
    document.getElementById('title').innerText = title
    document.getElementById('subtitle').innerText = subtitle
  }


  function renderListOfUsers(list, emptyMessage) {
    if(list.length !== 0 ) {
      let listTemplate = ''
      let location = ''
      list.map((user) => {
        location = `${user.location.city} - ${user.location.state}`
        listTemplate = listTemplate + `
          <tr id="userRow" class="table-row">
            <td>
              <img src="${user.picture.thumbnail}"/>  
              ${user.name.first}
            </td>
            <td title="${user.email}"> ${user.email} </td>
            <td> ${user.phone} </td>
            <td title="${location}" > ${location}</td>
            <td class="icons"> 
              <i id="remove-icon" class="fas fa-trash"></i>
              <i id="all-icon" class="fas fa-th-large"></i>
              <i id="attended-icon" class="fas fa-check"></i>
            </td> 
          </tr>
        `
        document.body.getElementsByClassName('table')[0].innerHTML = listTemplate
      })
    } else {
      document.body.getElementsByClassName('table')[0].innerHTML = `<div class="not-content"> ${emptyMessage}</div>`
    }
    addEvents()
  }
  
  (function() {

    let url = ''
    const seed = localStorage.getItem('seed')
    if(seed){ 
      url = `https://randomuser.me/api/?results=10&seed=${seed}&nat=br`
    } else {
      url = `https://randomuser.me/api/?results=10&nat=br}`
    }

    fetch(url).then((data) => {
    data.json().then(({ info, results }) => {
      localStorage.setItem('seed', info.seed)
      allUser = results
      selectedList = 'ALL'
      renderListOfUsers(allUser, allEmptyMessage)
    })
  })
  })()

  let searchInput = document.getElementById("search")
  searchInput.addEventListener("keyup", (event) => {
    let dataList = []
    switch (selectedList) {
      case 'REMOVE':
        dataList = removedUsers;
        break;
      case 'ALL': 
        dataList = allUser;
        break;
      case 'ATTENDED': 
        dataList = attendedUsers;
        break;
      default:
        dataList = allUser;
    }
    const results = dataList.filter((user) => {
      return user.name.first.toLowerCase().startsWith(event.target.value)
    })
    renderListOfUsers(results, searchEmptyMessage)
  })


  barsButton.addEventListener("click", () => {
    let navbarElement = document.getElementsByClassName("navbar")[0]
    isShowNavbar ? navbarElement.classList.add('appers') : navbarElement.classList.remove('appers')
    isShowNavbar = !isShowNavbar
  })

  removeTableButton.addEventListener("click", () => {
    selectedList = 'REMOVE'
    removeTableButton.classList.add('selected')
    allTableButton.classList.remove('selected')
    attendedButton.classList.remove('selected')

    renderListOfUsers(removedUsers, removeEmptyMessage)
  })

  allTableButton.addEventListener("click", () => {
    selectedList = 'ALL'
    allTableButton.classList.add('selected')
    removeTableButton.classList.remove('selected')
    attendedButton.classList.remove('selected')
    renderListOfUsers(allUser, allEmptyMessage)
  })

  attendedButton.addEventListener("click", () => {
    selectedList = 'ATTENDED'
    attendedButton.classList.add('selected')
    removeTableButton.classList.remove('selected')
    allTableButton.classList.remove('selected')
    renderListOfUsers(attendedUsers, attendedEmptyMessage)
  })

  const addEvents = () => {
    let removeButtonList = [...document.querySelectorAll('#remove-icon')]
    
    removeButtonList.map((removeButton) => {
      removeButton.addEventListener("click", (event) => {
        if( selectedList === 'ALL' || selectedList === 'ATTENDED') {
          const emailUser = event.path[2].children[1].innerText
          let dataList  = selectedList === 'ALL' ? allUser : attendedUsers
          let empty = selectedList === 'ALL' ? allEmptyMessage : attendedEmptyMessage
          const indexUser = dataList.findIndex((user) => user.email === emailUser)
          removedUsers.push(dataList[indexUser])
          dataList.splice(indexUser,1)
          renderListOfUsers(dataList, empty)
        }
      }) 
    })

    let attendedButtonList = [...document.querySelectorAll('#attended-icon')]
    
    attendedButtonList.map((attendedButton) => {
      attendedButton.addEventListener("click", (event) => {
        if( selectedList === 'ALL' || selectedList === 'REMOVE') {
          const emailUser = event.path[2].children[1].innerText
          let dataList  = selectedList === 'ALL' ? allUser : removedUsers
          let empty = selectedList === 'ALL' ? allEmptyMessage : removeEmptyMessage
          const indexUser = dataList.findIndex((user) => user.email === emailUser)
          attendedUsers.push(dataList[indexUser])
          dataList.splice(indexUser,1)
          renderListOfUsers(dataList, empty)
        }
      }) 
    })

    let allButtonList = [...document.querySelectorAll('#all-icon')]

    allButtonList.map((allButton) => {
      allButton.addEventListener("click", (event) => {
        if( selectedList === 'ATTENDED' || selectedList === 'REMOVE') {
          const emailUser = event.path[2].children[1].innerText
          let dataList  = selectedList === 'ATTENDED' ? attendedUsers : removedUsers
          let empty = selectedList === 'ATTENDED' ? attendedEmptyMessage : removeEmptyMessage
          const indexUser = dataList.findIndex((user) => user.email === emailUser)
          allUser.push(dataList[indexUser])
          dataList.splice(indexUser,1)
          renderListOfUsers(dataList, empty)
        }
      }) 
    })

    let userRowList = [...document.querySelectorAll("#userRow")]

    userRowList.map((userRow) => {
      userRow.addEventListener("click", (event) => {
        const emailUser = event.path.find(element => element.id === 'userRow').children[1].innerText
        const seed = localStorage.getItem('seed')
        console.log(emailUser)
        fetch(`https://randomuser.me/api/?results=10&seed=${seed}&nat=br`).then((data) => {
          data.json().then(({ results }) => {
            const user = results.filter((user) => emailUser === user.email)[0]
            renderShowUser(user)
          })
        })
      })
    })
  }



