'use strict';
{
  const opt = {
    articleSelector : '.post',
    titleSelector : '.post-title',
    titleListSelector : '.titles',
    articleTagsSelector : '.post-tags .list',
    articleAuthorSelector : '.post-author',
    authorsListSelector : '.authors',
    tagsListSelector : '.tags',
    cloudClassCount : 5,
    cloudClassPrefix : 'tag-size-'
  };

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    // console.log(event);

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    /* add class 'active' to the clicked link */
    // console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    // console.log(articleSelector);
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    // console.log(targetArticle);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const generateTitleLinks = function(customSelector = ''){
    /* remove contents of titleList */
    const titleList = document.querySelector(opt.titleListSelector);
    titleList.innerHTML='';
    /* for each article */
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);
    let html = '';

    for(let article of articles){
    /* get the article id */
      const articleId = article.getAttribute('id');
      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      /* insert link into titleList */
      // titleList.insertAdjacentHTML('afterbegin', linkHTML);
      html = html + linkHTML;
    }

    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const calculateTagsParams = function(tags){
    const tagsParams = {min: 999999, max: 0};
    for(let tag in tags){
      if(tags[tag] > tagsParams.max){
        tagsParams.max = tags[tag];
      } else if(tags[tag] < tagsParams.min) {
        tagsParams.min = tags[tag];
      }
    }
    return tagsParams;
  };

  const calculateTagClass = function(count, params){ //2, {min:1, max:5}
    /* create a const that will check difference between params minimum and count */
    const normalizedCount = count - params.min;
    /* create a const that will check difference between minimum and maximum of params */
    const normalizedMax = params.max - params.min;
    /* create a cons percentage of normalizedCount/normalizedMax  */
    const percentage = normalizedCount / normalizedMax;
    /* create a const that will calculate number for count (class ending) */
    const classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1 );
    /* return whole class name */
    return opt.cloudClassPrefix + classNumber;
  };

  const generateTags = function(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    // console.log(allTags);
    /* find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);
    // console.log(articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opt.articleTagsSelector);
      // console.log(tagsWrapper);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      // console.log(articleTags);
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      // console.log(articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        // console.log(tag);
        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        // console.log(linkHTML);
        /* add generated code to html variable */
        html = html + linkHTML;
        // console.log(html);
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opt.tagsListSelector);
    /* */
    const tagsParams = calculateTagsParams(allTags);
    // console.log('tagsParams:', tagsParams);
    /* [NEW] create variable for all links HTML code */
    let allTagsHTML = '';
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] create const tagLinkHTML that's generating code of a link */
      const tagLinkHTML = '<a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + ' </a>';
      // console.log(allTags[tag], tagsParams);
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsHTML += tagLinkHTML;
      // console.log(allTagsHTML);
    }
    /* [NEW] END LOOP: for each tag in allTags: */
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  };

  generateTags();

  const tagClickHandler = function(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinksEqualToHref = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let tagLinkEqualToHref of tagLinksEqualToHref) {
      /* add class active */
      tagLinkEqualToHref.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
    // console.log('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function(){
    /* find all links to tags */
    const links = document.querySelectorAll('.post-tags a, .list.tags a');
    /* START LOOP: for each link */
    for (let link of links) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  const generateAuthors = function(){
    /* crete object with all authors */
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find author wrapper */
      const authorWrapper = article.querySelector(opt.articleAuthorSelector);
      /* make html variable with empty string */
      let html = '';
      /* get author from data-author attribute */
      const articleAuthor = article.getAttribute('data-author');
      // console.log(articleAuthor);
      /*adding authors and counters to allAuthors object*/
      if(!allAuthors[articleAuthor]) {
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
      // console.log(allAuthors);
      /* generate HTML of the link */
      const linkHTML = '<a href="#' + articleAuthor + '">' + articleAuthor + '</a>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* insert HTML of all the links into the tags wrapper */
      authorWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const authorList = document.querySelector(opt.authorsListSelector);
    /* [NEW] create variable for all links HTML code */
    let allAuthorsHTML = '';
    /* [NEW] START LOOP: for each author in allauthors: */
    for(let author in allAuthors){
      /* [NEW] create const tagLinkHTML that's generating code of a link */
      const authorLinkHTML = '<li><a href="#' + author + '">' + author + ' (' + allAuthors[author] + ') </a></li>';
      // console.log(allTags[tag], tagsParams);
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allAuthorsHTML += authorLinkHTML;
      // console.log(allTagsHTML);
    }
    /* [NEW] END LOOP: for each tag in allTags: */
    /*[NEW] add HTML from allTagsHTML to tagList */
    authorList.innerHTML = allAuthorsHTML;
  };

  generateAuthors();

  const authorClickHandler = function(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    // console.log(href);
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#', '');
    // console.log(author);
    /* find all authors links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#"]');
    // console.log(activeAuthorLinks);
    /* START LOOP: for each active author link */
    for (let activeAuthorLink of activeAuthorLinks) {
      /* remove class active */
      activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active author link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const authorLinksEqualToHref = document.querySelectorAll('a[href="' + href + '"]');
    // console.log(authorLinksEqualToHref);
    /* START LOOP: for each found tag link */
    for (let authorLinkEqualToHref of authorLinksEqualToHref) {
      /* add class active */
      authorLinkEqualToHref.classList.add('active');
      // console.log(authorLinkEqualToHref);
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
    // console.log('[data-tags="' + author + '"]');
  };

  const addClickListenersToAuthors = function(){
    /* find all links to authors */
    const links = document.querySelectorAll('.post-author a, .authors a');
    /* START LOOP: for each link */
    for (let link of links) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToAuthors();
}
