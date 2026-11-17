const starterServices = [
  {
    id: "demo-1",
    name: "Nadiifinta guryaha",
    category: "Guri",
    city: "Stockholm",
    description:
      "Adeeg nadiifin guri oo ballan lagu qabsan karo. La xiriir adeeg-bixiyaha si aad u hesho faahfaahin.",
    price: "Qiime la isla garto",
    contact: "nadiifin@example.com",
    icon: "🏡",
    demo: true,
  },
  {
    id: "demo-2",
    name: "Naqshad Canva",
    category: "Dijitaal",
    city: "Göteborg",
    description:
      "Naqshadaynta qoraallada baraha bulshada, flyers iyo posters ganacsigaaga.",
    price: "Laga bilaabo 200 kr",
    contact: "naqshad@example.com",
    icon: "🎨",
    demo: true,
  },
  {
    id: "demo-3",
    name: "Website yar oo ganacsi",
    category: "Dijitaal",
    city: "Malmö",
    description:
      "Bog internet oo fudud oo ganacsigaaga lagu soo bandhigo, kuna shaqeeya telefoonka.",
    price: "Qiime la isla garto",
    contact: "web@example.com",
    icon: "💻",
    demo: true,
  },
  {
    id: "demo-4",
    name: "Caawinta guuritaanka",
    category: "Gaadiid",
    city: "Uppsala",
    description:
      "Caawimaad rarista alaabta iyo diyaarinta guuritaanka. Faahfaahinta horay uga heshiis.",
    price: "Laga bilaabo 300 kr",
    contact: "guuritaan@example.com",
    icon: "🚚",
    demo: true,
  },
  {
    id: "demo-5",
    name: "Casharro luqadeed",
    category: "Waxbarasho",
    city: "Stockholm",
    description:
      "Casharro iyo ku celcelin luqadeed oo qof-qof ah. Weydii luqadaha la heli karo.",
    price: "Laga bilaabo 180 kr",
    contact: "cashar@example.com",
    icon: "📚",
    demo: true,
  },
  {
    id: "demo-6",
    name: "Dayactir yar oo guri",
    category: "Dayactir",
    city: "Örebro",
    description:
      "Caawimaad dayactirro yaryar. Weydii adeeg-bixiyaha shaqooyinka uu qaban karo.",
    price: "Qiime la isla garto",
    contact: "dayactir@example.com",
    icon: "🛠️",
    demo: true,
  },
]
const icons = {
  Guri: "🏡",
  Dayactir: "🛠️",
  Dijitaal: "💻",
  Gaadiid: "🚚",
  Waxbarasho: "📚",
  Kale: "✨",
}
// Demo listings are clearly marked; real listings are loaded from Supabase.
const listEl = document.querySelector("#service-list")
const searchEl = document.querySelector("#search-input")
const categoryEl = document.querySelector("#category-filter")
const countEl = document.querySelector("#results-count")
const emptyEl = document.querySelector("#empty-state")
const formEl = document.querySelector("#service-form")
const messageEl = document.querySelector("#form-message")
const dashboardEl = document.querySelector("#dashboard")
const dashboardNavLink = document.querySelector("#dashboard-nav-link")
const myServiceListEl = document.querySelector("#my-service-list")
const myServiceCountEl = document.querySelector("#my-service-count")
const dashboardWelcomeEl = document.querySelector("#dashboard-welcome")
const dashboardMessageEl = document.querySelector("#dashboard-message")

function loadServices() {
  try {
    return starterServices
  } catch (error) {
    console.warn("AdeegLink: xogtii browser-ka lama akhrin karin.", error)
    return starterServices
  }
}
let services = loadServices()

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  )
}

function renderServices() {
  const searchTerm = searchEl.value.trim().toLocaleLowerCase("so")
  const selectedCategory = categoryEl.value
  const filtered = services.filter((service) => {
    const searchable =
      `${service.name} ${service.description} ${service.city} ${service.category}`.toLocaleLowerCase(
        "so",
      )
    const matchesSearch = searchable.includes(searchTerm)
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  listEl.innerHTML = filtered
    .map((service) => {
      const safeContact = String(service.contact).trim()
      const emailHref = /^\S+@\S+\.\S+$/.test(safeContact)
        ? `mailto:${encodeURIComponent(safeContact)}`
        : ""
      const phone = safeContact.replace(/[\s().-]/g, "")
      const phoneHref = /^\+?\d{7,15}$/.test(phone) ? `tel:${phone}` : ""
      const contactHref = emailHref || phoneHref
      const contactButton = contactHref
        ? `<a class="contact-link" href="${escapeHTML(contactHref)}">La xiriir adeeg-bixiyaha ↗</a>`
        : `<div class="contact-link">Xiriir: ${escapeHTML(safeContact)}</div>`
      return `<article class="service-card">
      <div class="card-top"><span class="service-icon" aria-hidden="true">${escapeHTML(service.icon || icons[service.category] || "✨")}</span><span><span class="category-pill">${escapeHTML(service.category)}</span>${service.demo ? '<span class="demo-pill">Tusaale</span>' : ""}</span></div>
      <h3>${escapeHTML(service.name)}</h3>
      <p class="description">${escapeHTML(service.description)}</p>
      <div class="service-meta"><span class="city">⌖ ${escapeHTML(service.city)}</span><span class="price">${escapeHTML(service.price || "Qiime la isla garto")}</span></div>
      ${contactButton}
    </article>`
    })
    .join("")

  countEl.textContent = `${filtered.length} adeeg${filtered.length === 1 ? "" : "yo"} la helay`
  emptyEl.hidden = filtered.length > 0
}

searchEl.addEventListener("input", renderServices)
categoryEl.addEventListener("change", renderServices)

async function loadServicesFromDatabase() {
  if (!supabaseClient) return
  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(
      "AdeegLink: adeegyada database-ka lama soo qaadi karin.",
      error,
    )
    messageEl.textContent =
      "Adeegyada online-ka lama soo qaadi karin. Hubi xiriirka Supabase."
    return
  }

  const onlineServices = (data || []).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    name: row.title,
    category: row.category,
    city: row.city || "",
    description: row.description,
    price: row.price || "Qiime la isla garto",
    contact: row.contact || "",
    icon: icons[row.category] || "✨",
    online: true,
  }))

  // Keep clearly-labelled demo listings, then add real listings from Supabase.
  services = [...onlineServices, ...starterServices]
  renderServices()
}

formEl.addEventListener("submit", async (event) => {
  event.preventDefault()
  if (!supabaseClient) {
    messageEl.textContent =
      "Supabase weli kuma xirmana. Hubi Publishable key-ga iyo internet-ka."
    return
  }

  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession()
  const user = sessionData?.session?.user
  if (sessionError || !user) {
    messageEl.textContent =
      "Fadlan marka hore akoonkaaga ka soo gal qaybta “Soo gal”, kadib adeeg ku dar."
    document.querySelector("#akoon").scrollIntoView({ behavior: "smooth" })
    return
  }

  const data = new FormData(formEl)
  const name = String(data.get("name") || "").trim()
  const city = String(data.get("city") || "").trim()
  const description = String(data.get("description") || "").trim()
  const contact = String(data.get("contact") || "").trim()
  const category = String(data.get("category") || "Kale")
  const price = String(data.get("price") || "").trim() || null

  if (!name || !city || !description || !contact) {
    messageEl.textContent = "Fadlan buuxi meelaha loo baahan yahay."
    return
  }

  const submitButton = formEl.querySelector('button[type="submit"]')
  submitButton.disabled = true
  messageEl.textContent = "Adeegga waxaa lagu kaydinayaa database-ka..."

  const { data: inserted, error } = await supabaseClient
    .from("services")
    .insert({
      user_id: user.id,
      title: name,
      category,
      description,
      price,
      city,
      contact,
    })
    .select()
    .single()

  submitButton.disabled = false
  if (error) {
    console.error("AdeegLink: adeegga lama kaydin karin.", error)
    messageEl.textContent = "Adeegga lama kaydin karin: " + error.message
    return
  }

  services.unshift({
    id: inserted.id,
    user_id: inserted.user_id,
    name: inserted.title,
    category: inserted.category,
    city: inserted.city || "",
    description: inserted.description,
    price: inserted.price || "Qiime la isla garto",
    contact: inserted.contact || "",
    icon: icons[inserted.category] || "✨",
    online: true,
  })
  renderServices()
  formEl.reset()
  messageEl.textContent =
    "Guul! Adeeggaaga waxaa lagu kaydiyey Supabase, wuxuuna ka muuqan karaa isticmaalayaasha kale."
  document.querySelector("#adeegyada").scrollIntoView({ behavior: "smooth" })
})

document.querySelector("#year").textContent = new Date().getFullYear()
renderServices()

// Supabase account features. Replace the placeholder below with your project's publishable key.
const SUPABASE_URL = "https://mqcgxvmscifgamunbbga.supabase.co"
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_HAy4iDuqZHlXYkT7VER1Zw_Y7urZcQp"

const authForm = document.querySelector("#auth-form")
const authName = document.querySelector("#auth-name")
const authEmail = document.querySelector("#auth-email")
const authPassword = document.querySelector("#auth-password")
const authMessage = document.querySelector("#auth-message")
const authStatus = document.querySelector("#auth-status")
const signupButton = document.querySelector("#signup-button")
const loginButton = document.querySelector("#login-button")
const logoutButton = document.querySelector("#logout-button")
const authNameLabel = document.querySelector("#auth-name-label")

let supabaseClient = null
let authMode = "signup"


async function loadMyServices(user) {
  if (!supabaseClient || !user) return
  myServiceListEl.innerHTML = '<p class="dashboard-loading">Adeegyadaada waa la soo rarayaa...</p>'
  dashboardMessageEl.textContent = ""

  const { data, error } = await supabaseClient
    .from("services")
    .select("id,title,category,description,city,price,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("AdeegLink: dashboard listings could not be loaded.", error)
    myServiceListEl.innerHTML = '<p class="dashboard-empty">Adeegyadaada hadda lama soo bandhigi karo. Hubi SELECT policy-ga Supabase ee user_id.</p>'
    dashboardMessageEl.textContent = "Xogta dashboard-ka lama soo qaadi karin. Fadlan hubi rukhsadaha database-ka."
    return
  }

  myServiceCountEl.textContent = String(data.length)
  if (!data.length) {
    myServiceListEl.innerHTML = '<div class="dashboard-empty"><span>✳</span><b>Weli adeeg ma aadan soo gelin.</b><small>Markaad adeeg cusub ku darto, halkan ayuu ka muuqan doonaa.</small><a href="#ku-dar">Ku dar adeeggaaga ↗</a></div>'
    return
  }

  myServiceListEl.replaceChildren(...data.map((service) => {
    const row = document.createElement("article")
    row.className = "my-service-row"
    const icon = document.createElement("span")
    icon.className = "my-service-icon"
    icon.textContent = icons[service.category] || "✨"
    const details = document.createElement("div")
    details.className = "my-service-details"
    const title = document.createElement("h4")
    title.textContent = service.title
    const meta = document.createElement("p")
    meta.textContent = [service.category, service.city, service.price || "Qiime la isla garto"].filter(Boolean).join(" · ")
    details.append(title, meta)
    const status = document.createElement("span")
    status.className = "listing-status"
    status.textContent = "Database"
    row.append(icon, details, status)
    return row
  }))
}

function setAuthMessage(message, isError = false) {
  authMessage.textContent = message
  authMessage.style.color = isError ? "#b42318" : "var(--green)"
}

function setAuthMode(mode) {
  authMode = mode
  const isSignup = mode === "signup"
  authNameLabel.hidden = !isSignup
  signupButton.hidden = false
  loginButton.hidden = false
  authPassword.autocomplete = isSignup ? "new-password" : "current-password"
  setAuthMessage(
    isSignup
      ? "Geli magacaaga, email-kaaga iyo password-ka."
      : "Geli email-kaaga iyo password-ka si aad u soo gasho.",
  )
}

function showSignedInState(user) {
  if (user) {
    dashboardEl.hidden = false
    dashboardNavLink.hidden = false
    const displayName =
      user.user_metadata?.full_name || user.email || "isticmaale"
    authStatus.textContent = `Waad soo gashay: ${displayName}`
    dashboardWelcomeEl.textContent = `Ku soo dhowow, ${displayName}. Halkan waxaad kala socon kartaa adeegyada aad soo gelisay.`
    loadMyServices(user)
    logoutButton.hidden = false
    signupButton.hidden = true
    loginButton.hidden = true
    authNameLabel.hidden = true
  } else {
    dashboardEl.hidden = true
    dashboardNavLink.hidden = true
    myServiceListEl.replaceChildren()
    myServiceCountEl.textContent = "0"
    authStatus.textContent = "Xaaladda: kuma aadan soo gelin."
    logoutButton.hidden = true
    setAuthMode("signup")
  }
}

function initSupabaseAuth() {
  if (!window.supabase?.createClient) {
    setAuthMessage(
      "Supabase library-ga lama soo dejin. Hubi internet-ka iyo script-ka index.html.",
      true,
    )
    signupButton.disabled = true
    loginButton.disabled = true
    return
  }

  if (
    !SUPABASE_PUBLISHABLE_KEY ||
    SUPABASE_PUBLISHABLE_KEY === "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
  ) {
    setAuthMessage(
      "Marka hore geli Supabase Publishable key gudaha app.js.",
      true,
    )
    return
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
  )
  loadServicesFromDatabase()

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error)
      setAuthMessage(
        "Xaaladda akoonka lama hubin karin: " + error.message,
        true,
      )
    showSignedInState(data?.session?.user || null)
  })

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    showSignedInState(session?.user || null)
    loadServicesFromDatabase()
  })
}

signupButton.addEventListener("click", () => setAuthMode("signup"))
loginButton.addEventListener("click", async () => {
  if (!supabaseClient) {
    setAuthMessage(
      "Marka hore geli Publishable key sax ah gudaha app.js.",
      true,
    )
    return
  }
  const email = authEmail.value.trim()
  const password = authPassword.value
  if (!email || !password) {
    setAuthMessage("Fadlan geli email iyo password.", true)
    return
  }
  loginButton.disabled = true
  setAuthMessage("Waa lagu soo gelinayaa...")
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })
  loginButton.disabled = false
  if (error) {
    setAuthMessage("Soo geliddu ma guulaysan: " + error.message, true)
    return
  }
  showSignedInState(data.user)
  setAuthMessage("Waad ku guulaysatay inaad soo gasho.")
})

authForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  if (!supabaseClient) {
    setAuthMessage(
      "Marka hore geli Publishable key sax ah gudaha app.js.",
      true,
    )
    return
  }
  const fullName = authName.value.trim()
  const email = authEmail.value.trim()
  const password = authPassword.value
  if (!fullName) {
    setAuthMessage("Fadlan geli magacaaga oo buuxa.", true)
    authName.focus()
    return
  }
  signupButton.disabled = true
  setAuthMessage("Akoonka waa la samaynayaa...")
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  signupButton.disabled = false
  if (error) {
    setAuthMessage("Isdiiwaangelintu ma guulaysan: " + error.message, true)
    return
  }
  if (data.session) {
    showSignedInState(data.user)
    setAuthMessage("Akoonka waa la sameeyey, waadna soo gashay.")
  } else {
    setAuthMessage(
      "Codsiga akoonka waa la diray. Fadlan ka eeg email-kaaga si aad u xaqiijiso akoonka ka hor intaadan soo gelin.",
    )
  }
  authPassword.value = ""
})

logoutButton.addEventListener("click", async () => {
  if (!supabaseClient) return
  logoutButton.disabled = true
  const { error } = await supabaseClient.auth.signOut()
  logoutButton.disabled = false
  if (error) {
    setAuthMessage("Ka bixiddu ma guulaysan: " + error.message, true)
    return
  }
  showSignedInState(null)
  setAuthMessage("Waad ka baxday akoonkaaga.")
})

initSupabaseAuth()
