import React, { Component } from "react";
import NewsItem from "./NewsItem";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      page: 1,
      isLoading: true,
      totalResults: 0,
    };
    document.title = `${this.props.category} - NewsMonkey`;
  }

  async componentDidMount() {
    await this.fetchArticles();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      await this.setState({ page: 1, articles: [] }); // Reset articles and page
      await this.fetchArticles();
    }
  }

  fetchArticles = async () => {
    this.setState({ isLoading: true });
    let url = `https://newsapi.org/v2/everything?q=${this.props.category}&apiKey=302ece26637040afb6283934df936bbe&page=${this.state.page}&pageSize=20`;
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState((prevState) => ({
        articles: [...prevState.articles, ...parsedData.articles],
        totalResults: parsedData.totalResults || 0,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ isLoading: false });
    }
  };

  fetchMoreData = async () => {
    await this.setState({ page: this.state.page + 1 });
    await this.fetchArticles();
  };

  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center">Top {this.props.category} Headlines</h2>

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={<h4>Loading...</h4>}
        >
          <div className="row">
            {this.state.articles.map((element, index) => (
              <div className="col-md-4" key={index}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : "No Title"}
                  description={
                    element.description
                      ? element.description.slice(0, 88)
                      : "No Description"
                  }
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={new Date(element.publishedAt).toLocaleString()}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default News;
