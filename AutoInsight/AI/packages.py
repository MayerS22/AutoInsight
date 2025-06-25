DARK_COLORS = ["#1A0D26", "#351B4B", "#4F2871", "#693696"]
LIGHT_COLORS = ["#9C69C9", "#B58ED7", "#CEB4E4", "#E6D9F2"]
OUTLIER_COLOR = "#FF5733"

# Apply nest_asyncio
nest_asyncio.apply()

# Initialize FastAPI app
app = FastAPI()

cloudinary.config(
    cloud_name="dwd6kau8a",
    api_key="414118375842875",
    api_secret="99IAqTayxvBkd2aC5DVY1kj1jR0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def plot_to_base64(fig):
    """Convert matplotlib plot to base64 string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close(fig)
    return image_base64

def is_likely_id_column(df, column):
    """Identifies if a column is likely an ID based on unique values ratio."""
    unique_ratio = df[column].nunique() / len(df)
    return unique_ratio > 0.5  # ID-like columns have high uniqueness

def generate_dynamic_recommendations(df, column):
    """Generates data-driven recommendations for a categorical column."""
    top_values = df[column].value_counts().head(3)
    total_count = len(df)

    insights = []
    for i, (value, count) in enumerate(top_values.items(), 1):
        percentage = count / total_count * 100
        insights.append(f"#{i}: '{value}' ({percentage:.1f}%)")

    # Dynamic recommendations based on patterns
    if top_values.iloc[0] / total_count > 0.5:
        recommendations = "One value dominates—consider diversifying or investigating bias."
    elif len(df[column].unique()) > 20:
        recommendations = "Many unique values—group similar categories for better insights."
    else:
        recommendations = "Balanced distribution—use for segmentation & targeting."

    return "\n".join(insights) + "\n\n" + recommendations

def generate_dynamic_categorical_insights(df, column):
    """Generates dynamic insights based on categorical distribution, including top 3 values."""
    category_counts = df[column].value_counts(normalize=True)
    total_values = len(df)
    unique_values = df[column].nunique()

    top_category = category_counts.idxmax()
    top_category_percentage = category_counts.max()

    insights = []

    if top_category_percentage > 0.5:
        insights.append(f"{column} is dominated by '{top_category}' ({top_category_percentage:.1%}).\n"
                        f"Consider diversifying strategies to balance market share.")

    if unique_values > 50 and top_category_percentage < 0.05:
        insights.append(f"{column} has {unique_values} unique categories, none dominant.\n"
                        f"Clustering (e.g., K-Means) may reveal hidden patterns.")

    if unique_values > 5 and top_category_percentage < 0.3:
        insights.append(f"{column} is well-distributed with {unique_values} unique values.\n"
                        f"Explore correlations with key business metrics like revenue.")

    if (category_counts < 0.01).sum() > unique_values * 0.5:
        insights.append(f"{column} has many low-frequency categories.\n"
                        f"Identify if these are niche products, seasonal trends, or data errors.")

    if unique_values < total_values * 0.05:
        insights.append(f"{column} likely represents key attributes like product types.\n"
                        f"Use this for targeted marketing and inventory optimization.")

    # Add the top 3 values and their percentages
    top_3_values = category_counts.head(3)
    top_3_text = "\n".join([f"{i+1}. '{val}' - {perc:.1%}" for i, (val, perc) in enumerate(top_3_values.items())])

    return "\n".join(insights) + "\n\nTop 3 Values:\n" + top_3_text if insights else f"'{column}' contains meaningful insights.\n\nTop 3 Values:\n{top_3_text}"

def generate_numerical_insights_ecommerce(df, column):
    """Generates insights based on numerical distributions, skewness, and outliers."""
    insights = []
    mean_val = df[column].mean()
    median_val = df[column].median()
    std_dev = df[column].std()
    skewness = df[column].skew()
    kurtosis = df[column].kurtosis()

    insights.append(f"Mean: {mean_val:.2f}, Median: {median_val:.2f}, Std Dev: {std_dev:.2f}")

    if abs(skewness) > 1:
        insights.append(f"Highly skewed (Skewness: {skewness:.2f})")
    elif abs(skewness) > 0.5:
        insights.append(f"Moderately skewed (Skewness: {skewness:.2f})")
    else:
        insights.append(f"Approximately Normal distribution (Skewness: {skewness:.2f})")

    if kurtosis > 3:
        insights.append(f"High peak and heavy tails (Kurtosis: {kurtosis:.2f})")
    elif kurtosis < -1:
        insights.append(f"Flatter distribution (Kurtosis: {kurtosis:.2f})")

    q1, q3 = df[column].quantile([0.25, 0.75])
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)][column]

    if not outliers.empty:
        insights.append(f"Outliers detected ({len(outliers)} values outside IQR range)")

    return "\n".join(insights)

def plot_top_categorical_counts_with_dynamic_insights_ecommerce(df):
    """
    Plots the top 10 categories based on count.
    Uses:
    - Pie charts for categorical columns with exactly 3 unique classes.
    - Bar charts for other categorical columns.
    """
    results = []
    filter_numbers=[5, 10, 15, 20]
    categorical_columns = df.select_dtypes(include=['object']).columns
    categorical_columns = [col for col in categorical_columns if not is_likely_id_column(df, col)]

    for column in categorical_columns:
            category_counts = df[column].value_counts().nlargest(10)
            plt.figure(figsize=(10, 5))
            if len(df[column].unique()) <= 3:  # Use pie chart if exactly 3 unique categories
                plt.pie(category_counts, labels=category_counts.index, autopct='%1.1f%%', colors=LIGHT_COLORS)
                plt.title(f"Distribution of {column} (Count)")
                plot_type = "pie_chart"
                insight_text = generate_dynamic_recommendations(df, column)
                plt.figtext(0.5, -0.25, insight_text, wrap=True, horizontalalignment='center', fontsize=10,
                    bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.3'))
                plt.tight_layout()
                fig = plt.gcf()
                results.append((plot_to_base64(fig), plot_type))
    for filter_number in filter_numbers:
        for column in categorical_columns:
            category_counts = df[column].value_counts().nlargest(filter_number)

            plt.figure(figsize=(10, 5))

            if len(df[column].unique()) != 3:  # Use bar chart for all other cases
                sns.barplot(y=category_counts.index, x=category_counts.values, palette=DARK_COLORS + LIGHT_COLORS)
                plt.xlabel("Count")
                plt.ylabel(column)
                plt.title(f"Top {filter_number} {column} Categories (by Count)")
                plot_type = "bar_chart"
                # Generate insights and recommendations
                insight_text = generate_dynamic_categorical_insights(df, column)
                plt.figtext(0.5, -0.25, insight_text, wrap=True, horizontalalignment='center', fontsize=10,
                    bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.3'))
                plt.tight_layout()
                fig = plt.gcf()
                results.append((plot_to_base64(fig), plot_type, filter_number))

            # plt.show()
    return results;

def plot_top_categorical_counts_with_dynamic_insights_education(df):
    """
    Plots the top 10 categories based on count.
    Uses:
    - Pie charts for categorical columns with exactly 3 unique classes.
    - Bar charts for other categorical columns.
    """
    results = []
    filter_numbers=[5, 10, 15, 20]
    categorical_columns = df.select_dtypes(include=['object']).columns
    categorical_columns = [col for col in categorical_columns if not is_likely_id_column(df, col)]

    for column in categorical_columns:
            category_counts = df[column].value_counts().nlargest(10)
            unique_values = df[column].nunique()
            plt.figure(figsize=(10, 6))
            if (unique_values) <= 3:  # Use pie chart if exactly 3 unique categories
                plt.pie(category_counts, labels=category_counts.index, autopct='%1.1f%%', colors=LIGHT_COLORS)
                plt.title(f"Distribution of {column} (Count)")
                plot_type = "pie_chart"
                insight_text = generate_dynamic_categorical_insights(df, column)
                plt.figtext(0.5, -0.25, insight_text, wrap=True, horizontalalignment='center', fontsize=10,
                    bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.3'))
                plt.tight_layout()
                fig = plt.gcf()
                results.append((plot_to_base64(fig), plot_type))
    for filter_number in filter_numbers:
        for column in categorical_columns:
            category_counts = df[column].value_counts().nlargest(filter_number)

            plt.figure(figsize=(10, 6))

            if len(df[column].unique()) > 3:  # Use bar chart for all other cases
                sns.barplot(y=category_counts.index, x=category_counts.values, palette=DARK_COLORS + LIGHT_COLORS)
                plt.xlabel("Count")
                plt.ylabel(column)
                plt.title(f"Top {filter_number} {column} Categories (by Count)")
                plot_type = "bar_chart"
                # Generate insights and recommendations
                insight_text = generate_dynamic_categorical_insights(df, column)
                plt.figtext(0.5, -0.25, insight_text, wrap=True, horizontalalignment='center', fontsize=10,
                    bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.3'))
                plt.tight_layout()
                fig = plt.gcf()
                results.append((plot_to_base64(fig), plot_type, filter_number))

            # plt.show()
    return results;

def plot_top_numerical_insights_ecommerce(df):
    """
    Analyzes numerical data and visualizes only meaningful distributions.
    - Filters out ID-like columns.
    - Uses histograms, line plots, and bar charts dynamically.
    """
    numerical_columns = df.select_dtypes(include=['int64', 'float64']).columns
    filter_numbers=[5, 10, 15, 20]
    # Remove ID-like columns (those with mostly unique values)
    filtered_numerical_columns = [col for col in numerical_columns if df[col].nunique() / len(df) < 0.9]
    results = []
    for filter_number in filter_numbers:
        for column in filtered_numerical_columns:
            plt.figure(figsize=(10, 5))

            # # Use different types of charts based on the data
            # if df[column].nunique() > 50:  # Continuous data -> line chart
            #     sns.lineplot(data=df[column], color=DARK_COLORS[0])
            #     plt.title(f"Trend of {column} Over Time")
            #     plt.xlabel("Index")
            #     plt.ylabel(column)

            # if df[column].nunique() > 5 and df[column].nunique() < 50:  # Moderate categories -> bar chart
            #     sns.barplot(x=df[column].value_counts().index[:filter_number], y=df[column].value_counts().values[:filter_number], palette=DARK_COLORS + LIGHT_COLORS)
            #     plt.title(f"Top 10 Values of {column}")
            #     plt.xlabel(column)
            #     plt.ylabel("Count")
            #     plot_type = "bar_chart"
            # else:  # Discrete numeric values -> histogram
            sns.histplot(df[column], kde=True, color=DARK_COLORS[0], bins=filter_number, label=generate_numerical_insights_ecommerce(df, column))
            plt.xlabel(column)
            plt.ylabel("Density")
            plt.title(f"Distribution of {column}")
            plot_type = "histogram"
            plt.legend(loc='upper right', fontsize=10, frameon=True, edgecolor='black')
            plt.tight_layout()
            fig = plt.gcf()
            results.append((plot_to_base64(fig), plot_type, filter_number))
    return results;
        # plt.show()

def generate_summary_report_image_education(df):
    categorical_columns = df.select_dtypes(include=['object']).columns
    insights = []

    # Title Section
    insights.append(("STUDENT PERFORMANCE REPORT\n", DARK_COLORS[0], "bold"))
    insights.append(("This report highlights key trends in student performance to help improve learning outcomes.\n\n\n\n", DARK_COLORS[1], "regular"))

    # Generate insights for each categorical column related to student performance
    for column in categorical_columns:
        value_counts = df[column].value_counts()
        top_value = value_counts.idxmax()
        count = value_counts.max()
        total = len(df)
        percentage = (count / total) * 100

        # Define color coding based on percentage
        if percentage > 50:
            color = LIGHT_COLORS[0]  # Most common category
            action = "This category represents a dominant student group. Ensure engagement continues.\n"
        elif percentage > 20:
            color = LIGHT_COLORS[1]  # Moderate category
            action = "This group is stable. Look for opportunities to boost performance.\n"
        else:
            color = LIGHT_COLORS[2]  # Low-performing category
            action = "This category has lower engagement. Develop strategies to support this group.\n"

        # Generate formatted insight
        insights.append((f"{column} Insights", DARK_COLORS[2], "bold"))
        insights.append((f"- Most Common: {top_value} ({count} times, {percentage:.1f}% of total)", DARK_COLORS[3], "regular"))
        insights.append((f"- {action}\n", color, "regular"))

    # Key Recommendations for improving student performance
    insights.append(("KEY RECOMMENDATIONS\n", DARK_COLORS[0], "bold"))
    insights.append(("- Focus on underperforming groups to enhance support and resources.", DARK_COLORS[1], "regular"))
    insights.append(("- Encourage high-performing students to mentor peers and share study techniques.", DARK_COLORS[1], "regular"))
    insights.append(("- Continuously monitor attendance and participation to prevent disengagement.\n", DARK_COLORS[1], "regular"))

    # Summary Section
    insights.append(("SUMMARY\n", DARK_COLORS[0], "bold"))
    insights.append(("This report provides insights into student engagement and performance. Use this data to refine teaching strategies and offer tailored support. Empower students through data-driven decisions to foster growth and academic success.", DARK_COLORS[1], "regular"))

    # Create figure with a white background
    fig, ax = plt.subplots(figsize=(12, 8), dpi=100, facecolor="white")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_frame_on(False)

    # Display text inside the figure with different colors and font weights
    y_position = 0.95
    for text, color, weight in insights:
        wrapped_text = "\n".join(wrap(text, width=90))
        ax.text(
            0.02, y_position, wrapped_text,
            fontsize=14,
            va="top", ha="left",
            family="Times New Roman",
            fontweight=weight,  # Use bold or regular
            linespacing=1.5,
            color=color
        )
        y_position -= 0.05  # Adjust spacing
    images = []
    plot_type='others'
    images.append((plot_to_base64(fig), plot_type))
    return images

def generate_summary_report_image_ecommerce(df):
    """
    Generates and displays a structured business insights report with enhanced readability,
    color-coded insights, and numerical breakdowns.

    Parameters:
        df (DataFrame): A Pandas DataFrame containing categorical data.
    """
    categorical_columns = df.select_dtypes(include=['object']).columns
    insights = []

    # Title Section
    insights.append(("STUDENT PERFORMANCE REPORT\n", DARK_COLORS[0], "bold"))
    insights.append(("This report highlights key trends in student performance to help improve learning outcomes.\n\n\n\n", DARK_COLORS[1], "regular"))

    # Generate insights for each categorical column related to student performance
    for column in categorical_columns:
        value_counts = df[column].value_counts()
        top_value = value_counts.idxmax()
        count = value_counts.max()
        total = len(df)
        percentage = (count / total) * 100

        # Define color coding based on percentage
        if percentage > 50:
            color = LIGHT_COLORS[0]  # Most common category
            action = "This category represents a dominant student group. Ensure engagement continues.\n"
        elif percentage > 20:
            color = LIGHT_COLORS[1]  # Moderate category
            action = "This group is stable. Look for opportunities to boost performance.\n"
        else:
            color = LIGHT_COLORS[2]  # Low-performing category
            action = "This category has lower engagement. Develop strategies to support this group.\n"

        # Generate formatted insight
        insights.append((f"{column} Insights", DARK_COLORS[2], "bold"))
        insights.append((f"- Most Common: {top_value} ({count} times, {percentage:.1f}% of total)", DARK_COLORS[3], "regular"))
        insights.append((f"- {action}\n", color, "regular"))

    # Key Recommendations for improving student performance
    insights.append(("KEY RECOMMENDATIONS\n", DARK_COLORS[0], "bold"))
    insights.append(("- Focus on underperforming groups to enhance support and resources.", DARK_COLORS[1], "regular"))
    insights.append(("- Encourage high-performing students to mentor peers and share study techniques.", DARK_COLORS[1], "regular"))
    insights.append(("- Continuously monitor attendance and participation to prevent disengagement.\n", DARK_COLORS[1], "regular"))

    # Summary Section
    insights.append(("SUMMARY\n", DARK_COLORS[0], "bold"))
    insights.append(("This report provides insights into student engagement and performance. Use this data to refine teaching strategies and offer tailored support. Empower students through data-driven decisions to foster growth and academic success.", DARK_COLORS[1], "regular"))

    # Create figure with a white background
    fig, ax = plt.subplots(figsize=(12, 8), dpi=100, facecolor="white")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_frame_on(False)

    # Display text inside the figure with different colors and font weights
    y_position = 0.95
    for text, color, weight in insights:
        wrapped_text = "\n".join(wrap(text, width=90))
        ax.text(
            0.02, y_position, wrapped_text,
            fontsize=14,
            va="top", ha="left",
            family="Times New Roman",
            fontweight=weight,  # Use bold or regular
            linespacing=1.5,
            color=color
        )
        y_position -= 0.05  # Adjust spacing

    images = []
    plot_type='others'
    images.append((plot_to_base64(fig), plot_type))
    return images

    # Show the report image
    # plt.show()

def is_id_column(df, col_name):
    """
    Detects ID-like columns dynamically based on uniqueness.
    If more than 50% of values are unique, the column is likely an identifier.
    """
    return df[col_name].nunique() > (0.5 * len(df))

def plot_kde_with_insights_ecommerce(df):
    """
    Generates Kernel Density Estimation (KDE) plots for numerical columns,
    filters out ID-like columns, analyzes variance, and annotates insights using a legend.
    """
    numerical_cols = [col for col in df.select_dtypes(include=[np.number]).columns if not is_id_column(df, col)]

    if not numerical_cols:
        print("No suitable numerical columns found for KDE plotting.")
        return
    results = []
    for col in numerical_cols:
        plt.figure(figsize=(10, 6))
        sns.kdeplot(df[col], shade=True, color=DARK_COLORS[2], linewidth=2, label=f"Distribution of {col}")

        # Calculate variance and standard deviation
        variance = np.var(df[col])
        std_dev = np.std(df[col])

        # Define variance categories dynamically based on column mean
        mean_value = df[col].mean()
        low_threshold = mean_value * 0.05
        high_threshold = mean_value * 0.5

        # Interpret variance levels
        if variance > high_threshold:
            insight = f"High Variance: {col} fluctuates significantly."
            recommendation = f"Investigate causes (e.g., seasonal trends, outliers)."
            action = f"Consider segmenting data for clearer patterns."
        elif variance < low_threshold:
            insight = f"Low Variance: {col} is stable with little change."
            recommendation = f"Check for missing diversity in data sources."
            action = f"Ensure data reflects realistic variations."
        else:
            insight = f"Moderate Variance: {col} has some fluctuation."
            recommendation = f"Monitor for unusual trends over time."
            action = f"Use smoothing techniques if needed."

        # Plot formatting
        plt.title(f"KDE Plot: {col}", fontsize=16, fontweight='bold', pad=20)
        plt.xlabel(col, fontsize=12)
        plt.ylabel("Density", fontsize=12)
        plot_type = 'kde'
        # Add insights as a legend instead of overlapping text
        plt.legend([f" {insight}\n {recommendation}\n {action}"], loc="best", fontsize=10, frameon=True)
        fig = plt.gcf()
        results.append((plot_to_base64(fig), plot_type))
    return results;

def plot_kde_with_insights_education(df):
    """
    Generates Kernel Density Estimation (KDE) plots for numerical columns,
    filters out ID-like columns, analyzes variance, and annotates insights using a legend.
    """
    numerical_cols = [col for col in df.select_dtypes(include=[np.number]).columns if not is_id_column(df, col)]

    if not numerical_cols:
        print("No suitable numerical columns found for KDE plotting.")
        return
    results = []
    for col in numerical_cols:
        plt.figure(figsize=(10, 6))
        sns.kdeplot(df[col], shade=True, color=DARK_COLORS[2], linewidth=2, label=f"Distribution of {col}")

        # Calculate variance and standard deviation
        variance = np.var(df[col])
        std_dev = np.std(df[col])

        # Define variance categories dynamically based on column mean
        mean_value = df[col].mean()
        low_threshold = mean_value * 0.05
        high_threshold = mean_value * 0.5

         # Interpret variance levels
        if variance > high_threshold:
            insight = f"High Variance: {col} shows significant differences in performance."
            recommendation = f"Investigate factors like study habits, class participation, or assignments."
            action = f"Provide personalized guidance for students who are struggling."
        elif variance < low_threshold:
            insight = f"Low Variance: {col} shows stable performance across students."
            recommendation = f"Ensure consistent assessment methods."
            action = f"Look into whether the assessments are appropriately challenging."
        else:
            insight = f"Moderate Variance: {col} shows some variation in student performance."
            recommendation = f"Monitor performance regularly and adapt teaching methods."
            action = f"Consider intervention for low-performing students or enrichment for high performers."

        # Plot formatting
        plt.title(f"KDE Plot: {col}", fontsize=16, fontweight='bold', pad=20)
        plt.xlabel(col, fontsize=12)
        plt.ylabel("Density", fontsize=12)
        plot_type = 'kde'
        # Add insights as a legend instead of overlapping text
        plt.legend([f" {insight}\n {recommendation}\n {action}"], loc="best", fontsize=10, frameon=True)
        fig = plt.gcf()
        results.append((plot_to_base64(fig), plot_type))
    return results;
        # plt.show()

def plot_correlation_matrix_ecommerce(df):
    """
    Plots a correlation matrix with business insights below the graph.
    """
    # Select only numerical columns
    numerical_df = df.select_dtypes(include=[np.number])

    # Compute correlation matrix
    corr_matrix = numerical_df.corr()

    # Define color mapping based on correlation strength
    cmap = sns.color_palette(DARK_COLORS + LIGHT_COLORS, as_cmap=True)

    # Plot the heatmap
    plt.figure(figsize=(12, 8))
    sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap=cmap, linewidths=0.5, vmin=-1, vmax=1)
    plt.title("Correlation Matrix Analysis", fontsize=14, fontweight='bold')

    # Generate Business Insights
    insights = []
    for col1 in corr_matrix.columns:
        for col2 in corr_matrix.columns:
            if col1 != col2:
                corr_value = corr_matrix.loc[col1, col2]
                if corr_value > 0.7:
                    insights.append(f"{col1} and {col2} have a strong positive correlation ({corr_value:.2f}). This suggests that increasing {col1} will likely increase {col2}.")
                elif corr_value < -0.7:
                    insights.append(f"{col1} and {col2} have a strong negative correlation ({corr_value:.2f}). This means when {col1} increases, {col2} tends to decrease.")
                elif 0.3 < corr_value < 0.7 or -0.7 < corr_value < -0.3:
                    insights.append(f"{col1} and {col2} have a moderate correlation ({corr_value:.2f}). There is a noticeable relationship, but other factors may influence it.")

    # Display Insights Below the Graph
    insight_text = "\n".join(insights)
    plt.figtext(0.5, -0.3, insight_text, wrap=True, horizontalalignment='center', fontsize=12, bbox=dict(facecolor='white', alpha=0.8))
    results = []
    fig = plt.gcf()
    plot_type = 'correlation'
    results.append((plot_to_base64(fig), plot_type));
    return results;

def plot_correlation_matrix_education(df):
    """
    Plots a correlation matrix with business insights below the graph.
    """
    # Select only numerical columns
    numerical_df = df.select_dtypes(include=[np.number])

    # Compute correlation matrix
    corr_matrix = numerical_df.corr()

    # Define color mapping based on correlation strength
    cmap = sns.color_palette(DARK_COLORS + LIGHT_COLORS, as_cmap=True)

    # Plot the heatmap
    plt.figure(figsize=(12, 8))
    sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap=cmap, linewidths=0.5, vmin=-1, vmax=1)
    plt.title("Correlation Matrix Analysis", fontsize=14, fontweight='bold')

    # Generate Business Insights
    insights = []
    for col1 in corr_matrix.columns:
        for col2 in corr_matrix.columns:
            if col1 != col2:
                corr_value = corr_matrix.loc[col1, col2]
                if corr_value > 0.7:
                    insights.append(f"{col1} and {col2} have a strong positive correlation ({corr_value:.2f}). This suggests that improvements in {col1} are likely to improve {col2}, e.g., better study habits may lead to better grades.")
                elif corr_value < -0.7:
                    insights.append(f"{col1} and {col2} have a strong negative correlation ({corr_value:.2f}). This means that as {col1} increases, {col2} tends to decrease, such as more time spent in social activities could reduce study time.")
                elif 0.3 < corr_value < 0.7 or -0.7 < corr_value < -0.3:
                    insights.append(f"{col1} and {col2} have a moderate correlation ({corr_value:.2f}). While there is a noticeable relationship, factors like individual learning styles or external support might also play a role.")

    # Display Insights Below the Graph
    insight_text = "\n".join(insights)
    plt.figtext(0.5, -0.3, insight_text, wrap=True, horizontalalignment='center', fontsize=12, bbox=dict(facecolor='white', alpha=0.8))
    fig = plt.gcf()
    plot_type = 'correlation'
    result = []
    result.append((plot_to_base64(fig), plot_type));
    return result;
    # plt.show()

def forecast_business_metrics_ecommerce(df):
    # Keywords to identify relevant columns
    keywords = [
        "sales", "profit", "revenue", "income", "return", "proceeds", "earnings",
        "yield", "incoming", "gain", "transactions", "deals", "purchases",
        "auctions", "bargains", "trades", "buys", "negotiations"
    ]

    # Identify columns dynamically
    target_cols = [col for col in df.columns if any(keyword in col.lower() for keyword in keywords)]

    if not target_cols:
        print("No relevant financial columns found. Forecasting is skipped.")
        return

    # Create a Date column from Year, Month, Day
    df['Date'] = pd.to_datetime(df[['Year', 'Month', 'Day']])

    # Aggregate data monthly
    df = df.groupby(pd.Grouper(key='Date', freq='M'))[target_cols].sum().reset_index()
    images = []
    filter_numbers = [6, 9, 12, 18, 24, 36]
    for filter_number in filter_numbers:
        for col in target_cols:
            plt.figure(figsize=(12, 6))  # Separate figure for each metric

            # Prepare data for Prophet
            data = df[['Date', col]].rename(columns={'Date': 'ds', col: 'y'})

            # Fit the Prophet model
            model = Prophet()
            model.fit(data)

            # Create future dates
            future = model.make_future_dataframe(periods=filter_number, freq='M')
            forecast = model.predict(future)

            # Calculate forecast accuracy
            actual_values = data['y'].values
            predicted_values = model.predict(data)['yhat'].values
            mape = mean_absolute_percentage_error(actual_values, predicted_values) * 100
            accuracy = 100 - mape  # Accuracy is 100 - MAPE

            # Plot results
            plt.plot(data['ds'], data['y'], label=f"Historical {col}", color="#B58ED7")
            plt.plot(forecast['ds'], forecast['yhat'], label=f"Forecast {col} (Accuracy: {accuracy:.2f}%)", color="#693696" , linestyle= 'dotted')

            plt.title(f"{col} Forecast")
            plt.xlabel("Date")
            plt.ylabel("Value")
            plt.legend(loc="best")
            fig = plt.gcf()
            plot_type='forecast'
            images.append((plot_to_base64(fig), plot_type, filter_number))
            # plt.show()
    return images;

def plot_score_distributions_education(df):
    """Plots distribution of student scores with stats, outliers, and embedded recommendations."""
    numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns
    filter_numbers=[5, 10, 15, 20]
    results=[]
    for filter_number in filter_numbers:
      for idx, column in enumerate(numerical_cols):
        data = df[column].dropna()

        # Core stats
        mean_val = data.mean()
        median_val = data.median()
        std_dev = data.std()
        variance = data.var()
        skewness = data.skew()

        # Distribution type
        if abs(skewness) < 0.5:
            dist_type = "Approximately Normal"
        elif skewness > 0.5:
            dist_type = "Right Skewed"
        else:
            dist_type = "Left Skewed"
        # Outlier detection (IQR)
        q1, q3 = data.quantile([0.25, 0.75])
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outliers = data[(data < lower_bound) | (data > upper_bound)]

        # Stats legend text
        legend_text = (
            f"Mean: {mean_val:.2f}\n"
            f"Median: {median_val:.2f}\n"
            f"Std Dev: {std_dev:.2f}\n"
            f"Variance: {variance:.2f}\n"
            f"Skewness: {skewness:.2f} ({dist_type})\n"
            f"Outliers: {len(outliers)}"
        )

        # Recommendation box text
        recommendations = []
        if variance > 100:
            recommendations.append("- High variance detected.")
        if abs(skewness) > 1:
            recommendations.append("- Highly skewed distribution. Consider normalization.")
        elif abs(skewness) > 0.5:
            recommendations.append("- Moderate skew. Watch for model bias.")
        else:
            recommendations.append("- Distribution is nearly normal.")
        if not outliers.empty:
            recommendations.append(f"- {len(outliers)} outliers found. Consider review/cleaning.")
        else:
            recommendations.append("- No significant outliers.")

        recommendation_text = "\n".join(recommendations)

        # Plot
        plt.figure(figsize=(10, 6))
        sns.histplot(data, kde=True, bins=30, color=DARK_COLORS[idx % len(DARK_COLORS)], label=None)
        if not outliers.empty:
            sns.rugplot(outliers, height=0.1, color=OUTLIER_COLOR, label="Outliers")

        plt.title(f"Distribution of {column}", fontsize=14)
        plt.xlabel(column)
        plt.ylabel("Count")

        # Stats legend
        plt.legend([legend_text], loc='upper right', fontsize=9, frameon=True, edgecolor='black')

        # Add recommendation box below plot
        plt.text(
            0.5, -0.35, recommendation_text,
            ha='center', va='top', transform=plt.gca().transAxes,
            fontsize=10, bbox=dict(boxstyle="round,pad=0.5", facecolor="#F2F2F2", edgecolor="#999")
        )

        plt.tight_layout(rect=[0, 0.05, 1, 1])  # Leave space at bottom for text
        fig = plt.gcf()
        plot_type='histogram'
        results.append((plot_to_base64(fig), plot_type, filter_number))
    return results

def plot_pca_clusters_education(df):
    numerical_cols = df.select_dtypes(include=['int64', 'float64'])

    if numerical_cols.shape[1] < 2:
        print("Not enough numerical features for PCA.")
        return

    # Standardize
    X = StandardScaler().fit_transform(numerical_cols)

    # Apply PCA
    pca = PCA(n_components=2)
    pca_result = pca.fit_transform(X)

    # KMeans for clustering
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(X)

    # Custom colors and labels
    DARK_COLORS = ["#1A0D26", "#9C69C9", "#4F2871"]
    cluster_colors = DARK_COLORS[:3]  # Use first three dark colors for clusters

    cluster_labels = {
        0: 'Group A - Possibly High Achievers',
        1: 'Group B - Average Performers',
        2: 'Group C - Students Needing Support'
    }

    # Plot
    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(pca_result[:, 0], pca_result[:, 1],
                         c=clusters, cmap=plt.cm.colors.ListedColormap(cluster_colors),
                         edgecolor='k', s=80, alpha=0.8)

    # Create legend
    handles = [plt.Line2D([0], [0], marker='o', color='w',
                          markerfacecolor=cluster_colors[i],
                          markersize=10,
                          label=f'Cluster {i}: {cluster_labels[i]}')
               for i in cluster_labels]

    plt.legend(handles=handles, title="Student Groups", bbox_to_anchor=(1.05, 1), loc='upper left')

    # More understandable axis labels
    plt.xlabel(f"Academic Performance Dimension 1 ({pca.explained_variance_ratio_[0]*100:.1f}% of variability)")
    plt.ylabel(f"Academic Performance Dimension 2 ({pca.explained_variance_ratio_[1]*100:.1f}% of variability)")

    plt.title("Student Performance Analysis: Grouping Similar Students")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    fig = plt.gcf()
    result=[]
    plot_type='others'
    result.append((plot_to_base64(fig), plot_type))
    return result;

def predictive_analysis_student_data(df):


    # Custom colors
    DARK_COLORS = ["#1A0D26", "#351B4B", "#4F2871", "#693696"]
    LIGHT_COLORS = ["#9C69C9", "#B58ED7", "#CEB4E4", "#E6D9F2"]

    df = df.copy()

    # Clean and encode
    df.dropna(axis=0, thresh=int(0.7 * df.shape[1]), inplace=True)
    df.dropna(axis=1, thresh=int(0.7 * df.shape[0]), inplace=True)
    df.dropna(inplace=True)

    cat_cols = df.select_dtypes(include='object').columns.tolist()
    num_cols = df.select_dtypes(include=np.number).columns.tolist()

    label_encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le

    # Automatically pick a target
    potential_targets = [col for col in df.columns if df[col].nunique() < 20 or df[col].dtype in [np.float64, np.int64]]
    target_col = potential_targets[-1]

    X = df.drop(columns=[target_col])
    y = df[target_col]
    feature_names = X.columns
    X_scaled = StandardScaler().fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    if len(np.unique(y)) <= 10:
        model = RandomForestClassifier(random_state=42)
        model_type = 'classification'
    else:
        model = RandomForestRegressor(random_state=42)
        model_type = 'regression'

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    plt.figure(figsize=(18, 6))

    # 1. Feature Importance
    plt.subplot(1, 3, 1)
    importances = model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    sns.barplot(
        x=importances[sorted_idx],
        y=feature_names[sorted_idx],
        palette=LIGHT_COLORS * (len(feature_names) // len(LIGHT_COLORS) + 1)
    )
    plt.title("What Factors Matter Most?")
    plt.xlabel("Impact Level")
    plt.ylabel("Inputs (e.g., behavior, scores)")
    plt.grid(True, linestyle='--', alpha=0.4)

    # 2. Actual vs Predicted or Confusion Matrix
    plt.subplot(1, 3, 2)
    if model_type == 'regression':
        sns.scatterplot(x=y_test, y=y_pred, color=LIGHT_COLORS[0], alpha=0.6)
        plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], 'r--')
        plt.xlabel("Real Outcome (Known)")
        plt.ylabel("Model Prediction")
        plt.title("How Close Are We to the Real Results?")
    else:
        cm = confusion_matrix(y_test, y_pred)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Purples')
        plt.title("Prediction Accuracy (Correct vs Wrong)")
        plt.xlabel("Predicted Category")
        plt.ylabel("Real Category")

    # 3. Summary + Recommendations
    plt.subplot(1, 3, 3)
    plt.axis('off')
    if model_type == 'regression':
        r2 = r2_score(y_test, y_pred)
        plt.text(0.01, 0.9, "Model Summary (Prediction of Scores)", fontsize=13, weight='bold')
        # print the accuracy in percentage
        plt.text(0.05, 0.8, f"Score accuracy : {r2* 100:.1f}%")
        # plt.text(0.05, 0.55, "Explanation: This tells us how well the model predicts student performance.")
        plt.text(0.05, 0.7, "Recommendation: Focus on top influencing features to improve overall scores.")
    else:
        report = classification_report(y_test, y_pred, output_dict=True)
        accuracy = report['accuracy']
        accuracy_pct = accuracy * 100
        plt.text(0.01, 0.9, "Model Summary (Category Prediction)", fontsize=13, weight='bold')
        plt.text(0.05, 0.75, f"Correct Predictions: {accuracy_pct:.1f}%")
        plt.text(0.05, 0.6, "Explanation: This percentage shows how many times the model predicted correctly.")
        plt.text(0.05, 0.45, "Recommendation:")
        plt.text(0.07, 0.35, "- Investigate misclassified cases for improvement.")
        plt.text(0.07, 0.25, "- Use top features to guide student support strategies.")
        plt.text(0.07, 0.15, "- Consider deeper analysis into the most influential inputs.")

    plt.tight_layout()
    plt.suptitle("Predictive Insights: Understanding Student Performance", fontsize=18, y=1.08)
    images=[]
    plot_type='others'
    fig=plt.gcf()
    images.append((plot_to_base64(fig), plot_type))
    return images;


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "detail": traceback.format_exc()
        }
    )

class CsvRequest(BaseModel):
    cloudinary_url: str

class insightsRequest(BaseModel):
    cloudinary_url: str
    domainType: str

@app.post("/clean-data")
async def clean_data(csv_request: CsvRequest):
    try:
        print(f"Received Cloudinary URL: {csv_request.cloudinary_url}")
        async with httpx.AsyncClient() as client:
            response = await client.get(csv_request.cloudinary_url)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to download CSV from Cloudinary URL"
                )
        content = response.content
        print(f"Downloaded content length: {len(content)} bytes")

        # Try different encodings
        encodings_to_try = ['latin-1', 'utf-8', 'iso-8859-1', 'cp1252']
        data = None

        for encoding in encodings_to_try:
            try:
                print(f"Trying {encoding} encoding...")
                data = pd.read_csv(io.StringIO(content.decode(encoding)))
                print(f"Successfully read CSV with {encoding} encoding")
                break
            except UnicodeDecodeError:
                continue
            except Exception as e:
                print(f"Error with {encoding}: {str(e)}")
                continue

        if data is None:
            raise HTTPException(
                status_code=400,
                detail="Could not read CSV file with any supported encoding"
            )

        # Step 2: Apply AutoClean
        cleaned_data = AutoClean(
            data,
            mode = 'manual',
            missing_num="auto",  # Impute missing numerical data
            missing_categ='auto',  # Impute missing categorical data
            outliers='auto',  # Detect and handle outliers
            duplicates = 'auto',
            extract_datetime = 's',
        )


        df_cleaned = cleaned_data.output
        # csv_buffer = io.StringIO()
        # df_cleaned.to_csv(csv_buffer, index=False)  # Save DataFrame to CSV format
        # csv_buffer.seek(0)  # Reset buffer position

        # 5️⃣ Upload the cleaned CSV to Cloudinary
        # /// / / upload_result = cloudinary.uploader.upload_large(csv_buffer, resource_type="raw", folder="processed_csvs")
        # upload_result = cloudinary.uploader.upload(csv_buffer.getvalue(), resource_type="raw", folder="processed_csvs")

        # Convert DataFrame to CSV string and encode it to bytes
        csv_str = df_cleaned.to_csv(index=False, sep=',', encoding='utf-8-sig', date_format='%Y-%m-%d')
        csv_bytes = csv_str.encode('utf-8-sig')
        file_size = len(csv_bytes)  # Get file size in bytes

        # Wrap the CSV bytes in a BytesIO stream (so it's not misinterpreted as a file name)
        csv_buffer = io.BytesIO(csv_bytes)
        csv_buffer.seek(0)

        # Define a threshold in bytes (e.g., 10 MB)
        THRESHOLD = 10 * 1024 * 1024  # 10 MB

        upload_result = None  # Initialize variable to ensure scope

        if file_size < THRESHOLD:
            # For smaller files, use the standard upload method with the file-like object
            upload_result = cloudinary.uploader.upload(
                csv_buffer,
                resource_type="raw",
                folder="processed_csvs"
            )
        else:
            # For larger files, use upload_large with the same binary stream
            csv_buffer.seek(0)  # Ensure pointer is at the beginning
            upload_result = cloudinary.uploader.upload_large(
                csv_buffer,
                resource_type="raw",
                folder="processed_csvs"
            )

        return {
            "message": "Cleaning completed successfully",
            'cleaned_csv': upload_result["secure_url"]
        }

    except Exception as e:
        print(f"Error processing file: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "traceback": traceback.format_exc()
            }
    )

@app.post("/analyze-data")
async def analyze_data(csv_request: insightsRequest):
    try:
        print(f"Received Cloudinary URL: {csv_request.cloudinary_url}")
        async with httpx.AsyncClient() as client:
            response = await client.get(csv_request.cloudinary_url)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to download CSV from Cloudinary URL"
                )
        content = response.content
        print(f"Downloaded content length: {len(content)} bytes")

        # Try different encodings
        encodings_to_try = ['latin-1', 'utf-8', 'iso-8859-1', 'cp1252']
        data = None

        for encoding in encodings_to_try:
            try:
                print(f"Trying {encoding} encoding...")
                data = pd.read_csv(io.StringIO(content.decode(encoding)))
                print(f"Successfully read CSV with {encoding} encoding")
                break
            except UnicodeDecodeError:
                continue
            except Exception as e:
                print(f"Error with {encoding}: {str(e)}")
                continue

        if data is None:
            raise HTTPException(
                status_code=400,
                detail="Could not read CSV file with any supported encoding"
            )
        cleaned_data = AutoClean(
            data,
            mode = 'manual',
            missing_num="auto",  # Impute missing numerical data
            missing_categ='auto',  # Impute missing categorical data
            outliers='auto',  # Detect and handle outliers
            duplicates = 'auto',
            extract_datetime = 's')
        # Generate visualizations
        images = []
        # Step 1: Initial exploration
        # print("Initial Dataset Overview:\n")
        # print("Null values in each column:\n", data.isnull().sum())
        # print("\nTotal Duplicates:", data.duplicated().sum())

        # data.head()
        # print no of rows
        # print("Number of rows in the dataset:", len(data))
        # print the outliers
        # data.describe()
        # identify column types
        # data.dtypes
        df_cleaned = cleaned_data.output
################################################################################################################################
        # cleaned csv phase (cloudinary)
        csv_str = df_cleaned.to_csv(index=False)
        csv_bytes = csv_str.encode('utf-8')
        file_size = len(csv_bytes)  # Get file size in bytes

        # Wrap the CSV bytes in a BytesIO stream (so it's not misinterpreted as a file name)
        csv_buffer = io.BytesIO(csv_bytes)
        csv_buffer.seek(0)

        # Define a threshold in bytes (e.g., 10 MB)
        THRESHOLD = 10 * 1024 * 1024  # 10 MB

        upload_result = None  # Initialize variable to ensure scope

        if file_size < THRESHOLD:
            # For smaller files, use the standard upload method with the file-like object
            upload_result = cloudinary.uploader.upload(
                csv_buffer,
                resource_type="raw",
                folder="processed_csvs"
            )
        else:
            # For larger files, use upload_large with the same binary stream
            csv_buffer.seek(0)  # Ensure pointer is at the beginning
            upload_result = cloudinary.uploader.upload_large(
                csv_buffer,
                resource_type="raw",
                folder="processed_csvs"
            )
################################################################################################################################################
        # data generation
        # Define color palettes
        DARK_COLORS = ["#1A0D26", "#351B4B", "#4F2871", "#693696"]
        LIGHT_COLORS = ["#9C69C9", "#B58ED7", "#CEB4E4", "#E6D9F2"]
        images = []
        domainType = csv_request.domainType
        if (domainType == 'ecommerce'):
          images.extend(plot_top_categorical_counts_with_dynamic_insights_ecommerce(df_cleaned))
          images.extend(plot_top_numerical_insights_ecommerce(df_cleaned))
          images.extend(generate_summary_report_image_ecommerce(df_cleaned))
          kde_images = plot_kde_with_insights_ecommerce(df_cleaned)
          if kde_images:
            images.extend(kde_images)
          images.extend(plot_correlation_matrix_ecommerce(df_cleaned))
          forecast_images = forecast_business_metrics_ecommerce(df_cleaned)
          if forecast_images:
              images.extend(forecast_images)
        elif (domainType == 'education'):
          images.extend(plot_top_categorical_counts_with_dynamic_insights_education(df_cleaned))
          images.extend(plot_score_distributions_education(df_cleaned))
          images.extend(generate_summary_report_image_education(df_cleaned))
          kde_images = plot_kde_with_insights_education(df_cleaned)
          if kde_images:
            images.extend(kde_images)
          images.extend(plot_correlation_matrix_education(df_cleaned))
          images.extend(plot_pca_clusters_education(df_cleaned))
          images.extend(predictive_analysis_student_data(df_cleaned))

        return {
            "message": "Analysis completed successfully",
            "images": images,
            "cleaned_csv": upload_result["secure_url"]
        }
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "traceback": traceback.format_exc()
            }
    )

class ReviewRequest(BaseModel):
    review: str

@app.post("/predict-review")
def predict_review(request: ReviewRequest):

    review = request.review
    is_sarcastic = detect_sarcasm(review)
    processed = preprocess_text(review)
    features = vectorizer.transform([processed])
    pred = model.predict(features)[0]

    if is_sarcastic and pred != 0:
        pred = 0

    confidence_scores = model.predict_proba(features)[0]
    confidence = round(confidence_scores[pred] * 100, 2)

    return {
        'sentiment': inv_label_map[pred],
        'confidence': confidence,
        'sarcasm_detected': is_sarcastic
    }

# Setup ngrok
ngrok.set_auth_token("2swgwcEJ5hsXEst7a5WBLtv58s8_5FtZDTirtSBKrSL4e8HUR")  # Replace with your ngrok auth token

# Run the FastAPI app
if __name__ == "__main__":
  public_url = ngrok.connect(8000, bind_tls=True).public_url
  print(f"FastAPI is publicly accessible at: {public_url}")
  uvicorn.run(
      "__main__:app",
      host="0.0.0.0",
      port=8000,
      log_config=None,  # Disable Uvicorn's default logging
      access_log=False  # Disable access logs
  )