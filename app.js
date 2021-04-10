// Common functions
function loadProblemInfo() {
  // Clean or initialize localStorage
  var problem_info = {}
  if (localStorage.getItem('zuqqhi2-leetcode-show-numlike')) {
    try {
      problem_info = JSON.parse(localStorage.getItem('zuqqhi2-leetcode-show-numlike'))
    } catch (e) {
      localStorage.removeItem('zuqqhi2-leetcode-show-numlike')
      localStorage.setItem('zuqqhi2-leetcode-show-numlike', '{}')
    }
  } else {
    localStorage.setItem('zuqqhi2-leetcode-show-numlike', '{}')
  }

  return problem_info
}

// Problem list page (Show number of like and dislike)
var observer = undefined
if (document.location.href.startsWith('https://leetcode.com/problemset/all/')) {
  observer = new MutationObserver(() => {
    const elems = document.querySelectorAll(".question-list-base > .question-list-table > .table > .reactable-data > tr")
    if (elems.length > 0) {
      // Clean or initialize localStorage
      var problem_info = loadProblemInfo()

      // Add header 
      const header_elem = document.querySelector(".question-list-base > .question-list-table > .table > thead > tr")
      header_elem.insertAdjacentHTML(
        `afterBegin`,
        `<th tabindex="0">like,dislike</th>`)

      // Generate number of like and dislike column
      for (const elem of elems) {
        const title = elem.getElementsByTagName("td")[2].getAttribute("value")
        
        var num_like = 0
        var num_dislike = 0
        if (title in problem_info) {
          num_like = problem_info[title]['num_like'];
          num_dislike = problem_info[title]['num_dislike'];
        }
  
        elem.insertAdjacentHTML(
          `afterBegin`,
          `<td id="zuqqhi2-leetcode-show-numlike" title="${title}">${num_like}, ${num_dislike}</td>`)
      }
  
      observer.disconnect()
    }
  })
  
  const targetNode = document.getElementsByClassName('question-list-base')[0]
  observer.observe(
    targetNode,
    {childList: true, subtree: true}
  )

// Each problem page (Save number of like and dislike)
// Note: MutationOberser doesn't work on this page. So, just using setInterval function.
} else {
  observer = () => {
    const elems = document.querySelectorAll(".btn__r7r7")
    if (elems.length === 4) {
      // Clean or initialize localStorage
      var problem_info = loadProblemInfo()
  
      // Initialize problem_info for current problem
      const title = document.querySelector('.css-v3d350').innerText.replace(/^[0-9]+\. /g, '')
      if (!(title in problem_info)) {
        problem_info[title] = {}
      }

      // Retrieve number of like and dislike
      const num_like = Number(elems[0].getElementsByTagName("span")[0].innerText)
      const num_dislike = Number(elems[1].getElementsByTagName("span")[0].innerText)
      
      // Update problem_info and localStorage
      problem_info[title]['num_like'] = num_like
      problem_info[title]['num_dislike'] = num_dislike
      localStorage.setItem('zuqqhi2-leetcode-show-numlike', JSON.stringify(problem_info))
      console.log('zuqqhi2-leetcode-show-numlike: localStorage updated')
    }
  }
  
  const observation = () => {
    console.log('zuqqhi2-leetcode-show-numlike: under observation...')
    const targetNode = document.getElementsByClassName('btn__r7r7')[0]
    if (targetNode !== undefined) {
      console.log('zuqqhi2-leetcode-show-numlike: observation is finished')
      observer()
      return true
    } else {
      return false
    }
  }
  const interval_id = setInterval(() => {
    if (observation()) { clearInterval(interval_id); }
  }, 500)
}

