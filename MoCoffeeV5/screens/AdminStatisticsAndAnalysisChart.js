import {useState, useEffect} from 'react';
import {View, Text, Dimensions, ScrollView} from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// CHARTS
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

export default function AdminStatisticsAndAnalysisChart({navigation}) {
  // Lấy ra chiều dài màn hinh
  const screenWidth = Dimensions.get('window').width;

  // LineChart V2
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Rainy Days'], // optional
  };

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    // backgroundGradientToOpacity: 0.5,
    // useShadowColorFromDataset: false, // optional
    // barPercentage: 0.5,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  // Bỏ số thập phân
  const chartConfig2 = {
    // backgroundColor: '#e26a00',
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0, // Số chữ số thập phân sẽ là 0
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  // ProgressChart
  // each value represents a goal ring in Progress chart
  const data2 = {
    labels: ['Swim', 'Bike', 'Run'], // optional
    data: [0.4, 0.6, 0.8],
  };

  // Bar chart
  const data3 = {
    labels: ['Yêu thích', 'Mua nhiều nhất'],
    legend: ['L1', 'L2', 'L3'],
    data: [
      [60, 60, 60],
      [30, 30, 60],
    ],
    barColors: ['red', '#ced6e0', '#a4b0be'],
  };

  // Pie chart
  const data4 = [
    {
      name: 'Cà phê',
      population: 21500000,
      color: '#ffae19',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Cà phê pha máy',
      population: 2800000,
      color: '#bdeddf',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Sinh tố',
      population: 577612,
      color: '#ccae88',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Sữa chua',
      population: 8538000,
      color: '#ffecc3',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Trà sữa',
      population: 11920000,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const dataV1 = {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    datasets: [
      {
        // data: [1, 2, 3, 4, 5, 6, 7],
        data: [
          Math.round(Math.random() * 50),
          Math.round(Math.random() * 50),
          Math.round(Math.random() * 50),
          Math.round(Math.random() * 50),
          Math.round(Math.random() * 50),
          Math.round(Math.random() * 50),
          48,
          // Math.round(Math.random() * 50),
        ],
      },
    ],
  };

  const dataV2 = {
    // labels: ['Bạc xỉu', 'Capuchino', 'Latte', 'Trà sữa nướng', 'Trà quất'],
    // labels: ['Bạc xỉu', 'Capuchino', 'Latte'],
    // datasets: [
    //   {
    //     // data: [1, 2, 3, 4, 5, 6, 7],
    //     data: [
    //       Math.round(Math.random() * 50),
    //       Math.round(Math.random() * 50),
    //       Math.round(Math.random() * 50),
    //     ],
    //   },
    // ],

    labels: ['Bạc xỉu', 'Capuchino', 'Latte'],
    datasets: [
      {
        data: [
          Math.round(15 + Math.random() * 50),
          Math.round(15 + Math.random() * 50),
          Math.round(15 + Math.random() * 50),
        ],
      },
    ],
  };

  // const formatYLabel = value => `${value}`;
  const formatYLabel = value => {
    return `${value}`;
  };

  const graphStyle = {
    marginVertical: 8,
    borderRadius: 16,
  };

  const chartConfig3 = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 76, 255, ${opacity})`, // Màu của cột dữ liệu
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu của nhãn
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      stroke: '#dbdbff',
    },
    propsForLabels: {
      fontSize: 12,
      rotation: 0, // Chữ sẽ hiển thị ngang
      alignSelf: 'center', // Đặt vị trí chữ là giữa
    },
    propsForVerticalLabels: {
      fontSize: 12,
    },
    barPercentage: 0.7, // Độ rộng của cột dữ liệu
    fillShadowGradientFrom: '#4c4cff', // Màu bắt đầu của gradient mờ dần
    fillShadowGradientTo: '#dbdbff', // Màu kết thúc của gradient mờ dần
  };

  // Nếu bạn muốn cột có màu từ trên xuống dần, bạn cũng có thể cài đặt fillGradient từ chartConfig
  // Ví dụ:
  // chartConfig: {
  //   fillGradient: {
  //     colors: ['#4c4cff', '#a3a3ff'],
  //     start: { x: 0, y: 0 },
  //     end: { x: 0, y: 1 },
  //   },
  // }

  return (
    <SafeAreaProvider>
      <CustomStatusBar
        backgroundColor='#fff'
        canGoBack={true}
        heightOfTop={50}
        customStyleIconBack={{marginBottom: 20}}
        customStyleFormStatusBar={{
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 0},
          elevation: 5,
          // maxHeight: 200,
          maxHeight: 500,
        }}
        arrowIconColor={'#000'}
        arrowIconBackgroundColor={'#fff'}
        titleOfScreen={'Thống kê'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'AdminDashboardScreen',
        }}
      />
      <ScrollView style={{flex: 1}}>
        {/* START: DANH SỐ */}
        <View
          style={{
            // backgroundColor: 'lightblue',
            height: 200,
            width: '100%',
            paddingTop: 100,
          }}>
          <View style={{paddingLeft: 12, paddingTop: 10}}>
            <Text style={{fontSize: 16}}>Tháng 5, 2024</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              maxHeight: 100,
              minHeight: 100,
              marginBottom: 50,
              // backgroundColor: 'red',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                minWidth: 140,
                maxWidth: 140,
                marginLeft: 14,
                // backgroundColor: 'red',
              }}>
              <Text style={{fontSize: 14, fontWeight: '600'}}>DOANH THU</Text>
              <Text style={{fontSize: 18, fontWeight: '700'}}>10,395,000₫</Text>
            </View>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: 'gray',
                marginBottom: 10,
                marginTop: 10,
                marginHorizontal: 16,
              }}
            />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: 100,
                marginLeft: 14,
              }}>
              <Text style={{fontSize: 14, fontWeight: '600'}}>ĐƠN HÀNG</Text>
              <Text style={{fontSize: 18, fontWeight: '700'}}>315</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: 100,
                marginLeft: 14,
              }}>
              <Text style={{fontSize: 14, fontWeight: '600'}}>ĐƠN HỦY</Text>
              <Text style={{fontSize: 18, fontWeight: '700', color: 'red'}}>
                5
              </Text>
            </View>
          </View>
        </View>
        {/* END: DANH SỐ */}

        <View style={{paddingLeft: 12, paddingTop: 40}}>
          <Text style={{fontSize: 16, color: 'gray'}}>
            Biểu đồ số đơn đặt hàng trong tuần
          </Text>
        </View>
        {/* ############### START: LineChart ############### */}
        <LineChart
          data={dataV1}
          width={screenWidth}
          height={220}
          // yAxisLabel='$'
          // yAxisSuffix='k'
          // yAxisInterval={2} // optional, defaults to 1
          chartConfig={chartConfig2}
          formatYLabel={formatYLabel} // Sử dụng formatYLabel để loại bỏ số thập phân
          bezier
          style={graphStyle}
        />
        {/* ############### END: LineChart ############### */}

        {/* ############### START: ProgressChart ############### */}
        {/* <ProgressChart
          data={data2}
          width={screenWidth}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
        <View style={{height: 40}} /> */}
        {/* ############### END: ProgressChart ############### */}

        {/* ############### START: Pie chart ############### */}
        <View style={{paddingLeft: 12, paddingTop: 40}}>
          <Text style={{fontSize: 16, color: 'gray'}}>
            Biểu đồ danh mục sản phẩm yêu thích
          </Text>
        </View>
        <PieChart
          data={data4}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          // paddingLeft={'15'}
          center={[10, 10]}
          // absolute
        />
        {/* ############### END: Pie chart ############### */}

        <View style={{paddingLeft: 12, paddingTop: 40}}>
          <Text style={{fontSize: 16, color: 'gray'}}>
            Biểu đồ sản phẩm bán chạy
          </Text>
        </View>
        <BarChart
          style={graphStyle}
          data={dataV2}
          width={screenWidth}
          height={220}
          // yAxisLabel='$'
          chartConfig={chartConfig3}
          verticalLabelRotation={30}
        />

        {/* ĐỆM DƯỚI */}
        <View style={{height: 500, backgroundColor: 'grey'}} />
      </ScrollView>
    </SafeAreaProvider>
  );
}
